import Interceptor from '../../src/interceptor';

describe('Interceptor', () => {
  describe('#enable', () => {
    it('should enable HTTP request intercepting');
    it('should be configurable by port');
  });

  describe('#disable', () => {
    it('should disable HTTP request intercepting');
  });

  describe('event "intercept"', () => {
    it('should emit an "intercept" event when a request is intercepted');
    it('should should provide us a reference to the originating ClientRequest');
    it('should allow us to mock a response if proxying is disabled');
  });

  describe('event "proxied"', () => {
    it('should emit a "proxied" event when a request is proxied');
  });
});
