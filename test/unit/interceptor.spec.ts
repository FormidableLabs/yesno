describe('Interceptor', () => {
  describe('#enable', () => {
    it('should enable HTTP request intercepting');
    it('should be configurable by port');
    it('should bypass requests on other ports');
    it('should abort the proxied request if the intercepted request is aborted');
    it('should emit an error on the intercepted request if the proxied request errors');
    it('should timeout the intercepted request if the proxied request times out');
  });

  describe('#disable', () => {
    it('should disable HTTP request intercepting');
    it('should take no action if already disabled');
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
