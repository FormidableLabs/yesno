import { expect } from 'chai';
import yesno from '../src';
import * as apiClient from './src/api-client';

describe('my api', () => {
  const itRecorded = yesno.test({
    dir: `${__dirname}/mocks`,
    it,
    prefix: 'recorded-tests-my-api',
  });

  describe('/api/me', () => {
    const username = 'example-username';
    const password = 'example-password';

    itRecorded('should respond with the current user', async () => {
      const token = await apiClient.login(username, password);
      const user = await apiClient.getCurrentUser(token);

      yesno.matching(/login/).redact(['response.body.data.token', 'request.body.token']);
      yesno.matching(/api\/me/).redact(['request.headers.authorization']);

      expect(yesno.intercepted()).to.have.lengthOf(2);
      expect(user).to.eql((yesno.matching(/api\/me/).response().body as any).data);
    });

    itRecorded('should respond 401 for an invalid token', async () => {
      await expect(apiClient.getCurrentUser('foobar')).to.be.rejected;
      expect(yesno.matching(/me/).response()).to.have.nested.property('statusCode', 401);
    });
  });
});
