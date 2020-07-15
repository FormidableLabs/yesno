import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import rp from 'request-promise';
import { StatusCodeError } from 'request-promise/errors';
import yesno from '../src';
import * as apiClient from './src/api-client';

const YESNO_RECORDING_MODE = 'YESNO_RECORDING_MODE';

describe('my api', () => {
  beforeEach(() => yesno.spy({ ignorePorts: [9999] }));
  afterEach(() => yesno.restore());

  describe('/api/me', () => {
    const username = 'example-username';
    const password = 'example-password';
    const tmpDir = path.join(__dirname, 'tmp');
    const filename = `${tmpDir}/example-recording.json`;

    after(() => fs.unlinkSync(filename));

    it('should respond with the current user', async () => {
      const token = await apiClient.login(username, password);
      const user = await apiClient.getCurrentUser(token);

      expect(yesno.intercepted()).to.have.lengthOf(2);
      expect(yesno.matching(/api\/me/).response().statusCode).to.eql(200);
      expect(user).to.eql((yesno.matching(/api\/me/).response().body as any).data);
    });

    it('should respond 401 for an invalid token', async () => {
      await expect(apiClient.getCurrentUser('foobar')).to.be.rejected;
      expect(yesno.matching(/me/).response()).to.have.nested.property('statusCode', 401);
    });

    it('should reject for a 500 response', async () => {
      yesno.mock([
        {
          request: {
            host: 'localhost',
            method: 'GET',
            path: '/api/me',
            port: 3000,
            protocol: 'http',
          },
          response: {
            body: 'Mock failure',
            statusCode: 500,
          },
        },
      ]);

      await expect(apiClient.getCurrentUser('any-token')).to.be.rejectedWith(
        '500 - "Mock failure"',
      );
      expect(yesno.matching(/me/).response()).to.have.nested.property('statusCode', 500);
    });

    it('should ignore localhost when recording', async () => {
      process.env[YESNO_RECORDING_MODE] = 'record';
      const recording = await yesno.recording({ filename });

      yesno.matching(/\/localhost/).ignore();

      const token = await apiClient.login(username, password);

      await rp.get({
        headers: {
          'x-test-header': 'foobar',
        },
        json: true,
        uri: 'http://postman-echo.com/get',
      });

      const user = await apiClient.getCurrentUser(token);

      expect(yesno.intercepted(), 'Returns all intercepted requests').to.have.lengthOf(3);
      await recording.complete();
    });

    it('should load recording and proxy ignored urls', async () => {
      process.env[YESNO_RECORDING_MODE] = 'mock';
      const mocks = await yesno.load({ filename });

      expect(mocks).to.have.lengthOf(3);
      expect(mocks[0]).to.have.nested.property('__id', 'ignored');
      expect(mocks[1]).to.have.nested.property('request.host', 'postman-echo.com');

      yesno.mock(mocks);

      const token = await apiClient.login(username, password);

      const response = await rp.get({
        headers: {
          'x-test-header': 'fizbaz',
        },
        json: true,
        uri: 'http://postman-echo.com/get',
      });

      // saved mock should return the orignial test header
      expect(response).to.have.nested.property('headers.x-test-header', 'foobar');

      // calls to localhost should be proxied
      await expect(apiClient.getCurrentUser('bad-token')).to.be.rejectedWith(
        '{"error":{"message":"Invalid API key"}}',
      );
    });
  });
});
