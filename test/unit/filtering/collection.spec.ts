describe('FilteredHttpCollection', () => {
  describe('#intercepted', () => {
    it('should return all intercepted requests in the collection that match the filter');
  });

  describe('#mocks', () => {
    it('should return all mocks in the collection that match the filter');
  });

  describe('#redact', () => {
    it('should allow redacting a single property');
    it('should allow redacting a multiple properties');
    it('should allow redacting properties nested within arrays');
    it('should ignore properties absent in the request');
    it('should support overriding the redact symbol');
    it('should support a callback to customize redacting');
  });
});
