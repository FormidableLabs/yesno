import { expect } from 'chai';
import yesno from '../../../src';
import Context from '../../../src/context';
import FilteredHttpCollection from '../../../src/filtering/collection';

describe.only('FilteredHttpCollection', () => {
  describe('#redacted', () => {
    it('should effect the provided array', async () => {
      const context = new Context();
      context.interceptedRequestsCompleted = await yesno.load({
        filename: `${__dirname}/mocks/two-requests.json`,
      });
      expect(context.interceptedRequestsCompleted[0]).to.have.nested.property(
        'request.path',
        '/fiz',
      );
      expect(context.interceptedRequestsCompleted[1]).to.have.nested.property(
        'request.path',
        '/foo',
      );

      const collection = new FilteredHttpCollection({ context, matcher: { url: /foo/ } });
      collection.redact(['request.path']);

      expect(context.interceptedRequestsCompleted[0]).to.have.nested.property(
        'request.path',
        '/fiz',
      );
      expect(context.interceptedRequestsCompleted[1]).to.have.nested.property(
        'request.path',
        '*****',
      );
    });
  });

  describe('#intercepted', () => {
    it('should return all intercepted requests in the collection that match the filter');
  });

  describe('#mocks', () => {
    it('should return all mocks in the collection that match the filter');
  });
});
