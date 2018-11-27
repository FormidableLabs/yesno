import { expect } from 'chai';
import { StatusCodeError } from 'request-promise/errors';
import yesno from '../src';
import * as apiClient from './src/api-client';

describe('my api', () => {
  beforeEach(() => yesno.spy({ ignorePorts: [9999] }));
  afterEach(() => yesno.restore());

  describe('/api/me', () => {
    const username = 'example-username';
    const password = 'example-password';

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
  });
});
