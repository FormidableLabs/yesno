import { json as jsonParser } from 'body-parser';
import express from 'express';
import { Server } from 'http';
const debug = require('debug')('yesno:test-server');

export const PORT = 3001;

export const URI_ENDPOINT_GET = `http://localhost:${PORT}/get`;
export const URI_ENDPOINT_POST = `http://localhost:${PORT}/post`;

export interface ITestServer extends Server {
  getRequestCount: () => number;
}

export function start(port: number = PORT): Promise<ITestServer> {
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
    res.setHeader('x-test-server-header', 'foo');
    res.send({ headers, method: 'GET', path: '/get' });
  });

  app.post('/post', ({ headers, body }: express.Request, res: express.Response) => {
    debug('Received POST request');
    res.status(headers['x-status-code'] ? parseInt(headers['x-status-code'] as string, 10) : 200);
    res.setHeader('x-test-server-header', 'foo');
    res.send({ headers, body, method: 'POST', path: '/post' });
  });

  return new Promise((resolve) => {
    const server = app.listen(port, () => {
      debug('Test server running on port %d', port);
      (server as any).getRequestCount = () => requestCount;
      resolve(server as ITestServer);
    });
  });
}
