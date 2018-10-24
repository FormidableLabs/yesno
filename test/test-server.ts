import { json as jsonParser } from 'body-parser';
import express from 'express';
import { Server } from 'http';
const debug = require('debug')('yesno:test-server');

export interface ITestServer extends Server {
  getRequestCount: () => number;
}

export function start(port: number = 3001): Promise<ITestServer> {
  let requestCount: number = 0;
  const app = express();
  app.use(jsonParser());

  app.use((req, res, next) => {
    requestCount++;
    next();
  });

  app.get('/get', ({ headers }: express.Request, res: express.Response) => {
    debug('Received GET request');
    res.status(headers['x-status-code'] ? parseInt(headers['x-status-code'] as string, 10) : 200);
    res.send({ headers, message: 'Get' });
  });

  app.post('/post', ({ headers, body }: express.Request, res: express.Response) => {
    debug('Received POST request');
    res.status(headers['x-status-code'] ? parseInt(headers['x-status-code'] as string, 10) : 200);
    res.send({ headers, body });
  });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug('Test server running on port %d', port);
      (server as any).getRequestCount = () => requestCount;
      resolve(server as ITestServer);
    });
  });
}
