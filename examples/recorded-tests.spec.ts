import { expect } from 'chai';
import yesno from '../src';
import * as apiClient from './src/api-client';

describe('my api', () => {
  const itRecorded = yesno.test({ it, dir: `${__dirname}/mocks` });

  describe('/api/me', () => {
    const username = 'example-username';
    const password = 'example-password';

    beforeEach(() => {
      yesno.matching(/login/).redact(['response.body.token']);
      yesno.matching(/api\/me/).redact(['request.headers.authorization']);
    });

    itRecorded('should respond with the current user', async () => {
      const token = await apiClient.login(username, password);
      const user = await apiClient.getCurrentUser(token);

      expect(yesno.intercepted()).to.have.lengthOf(2);
      expect(user).to.eql((yesno.matching(/api\/me/).response().body as any).data);
    });

    itRecorded('should respond 401 for an invalid token', async () => {
      await apiClient.getCurrentUser('foobar');
      expect(yesno.matching(/me/).response()).to.have.nested.property('statusCode', 401);
    });
  });
});
