import { json as jsonParser } from 'body-parser';
import express from 'express';
const debug = require('debug')('yesno:test-server');

export function start(port: number = 3001): Promise<express.Application> {
  const app = express();
  app.use(jsonParser());

  app.get('/get', ({ headers }: express.Request, res: express.Response) => {
    debug('Received GET request');
    res.send({ headers, message: 'Get' });
  });

  app.post(
    '/post',
    ({ headers, body }: express.Request, res: express.Response) => {
      debug('Received POST request');
      res.send({ headers, body });
    });

  return new Promise((resolve) => {
    app.listen(port, () => {
      debug('Test server running on port %d', port);
      resolve(app);
    });
  });
}
