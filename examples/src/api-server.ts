import { json as jsonParser } from 'body-parser';
import express from 'express';
import { Server } from 'http';
const debug = require('debug')('yesno:example-api-server');
import { v4 as uuidV4 } from 'uuid';

export const VALID_USERNAME = 'example-username';
export const VALID_PASSWORD = 'example-password';
const usersByUsername: { [key: string]: object } = {
  [VALID_USERNAME]: {
    id: 1,
    password: VALID_PASSWORD,
    username: VALID_USERNAME,
  },
};
const tokens: { [key: string]: string } = {};

export const PORT = 3000;

export interface ITestServer extends Server {
  getRequestCount: () => number;
}

export function start(port: number = PORT): Promise<ITestServer> {
  let requestCount: number = 0;
  const app = express();
  app.use(jsonParser());

  app.use((req, res, next) => {
    debug(`Request: ${req.method} ${req.path}`);
    requestCount++;
    next();
  });

  app.post('/api/login', ({ body }: express.Request, res: express.Response) => {
    const { username, password } = body;
    if (!username || !password) {
      return res.status(400).send({ error: { message: 'Invalid request' } });
    }

    if (username !== VALID_USERNAME || password !== VALID_PASSWORD) {
      return res.status(401).send({ error: { message: 'Incorrect username/password' } });
    }

    const token = uuidV4();
    tokens[token] = username;

    res.status(201).send({ data: { token } });
  });

  app.use('/api/*', (req, res, next) => {
    const token = req.headers.authorization;
    if (!token || !tokens[token]) {
      return res.status(401).send({ error: { message: 'Invalid API key' } });
    }

    next();
  });

  app.get('/api/me', (req: express.Request, res: express.Response) => {
    const token = req.headers.authorization;

    if (!token) {
      return res.status(400).send({ error: { message: 'Missing token' } });
    }

    const user = usersByUsername[tokens[token]];

    if (!user) {
      debug('User missing');
      return res.status(500).send({ error: { message: 'Failed to retrieve user for token' } });
    }

    res.send({ data: user });
  });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug('Test server running on port %d', port);
      (server as any).getRequestCount = () => requestCount;
      resolve(server as ITestServer);
    });
  });
}

if (!module.parent) {
  (async () => await start())();
}
