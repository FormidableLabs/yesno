describe('http-serializer', () => {
  describe('RequestSerializer', () => {
    describe('constructor', () => {
      it('should set defaults');
    });

    describe('#serialize', () => {
      it('should return a SerializedRequest representing the current request');
      it('should convert JSON bodies to objects');
      it('should degrade to string if JSON parsing fails');
    });
  });

  describe('ResponseSerializer', () => {
    describe('constructor', () => {
      it('should set defaults');
    });

    describe('#serialize', () => {
      it('should return a SerializedRequest representing the current request');
      it('should convert JSON bodies to objects');
      it('should degrade to string if JSON parsing fails');
    });
  });

  describe('#formatUrl', () => {
    it('should create a url without port or query params');
  });

  describe('#createRecord', () => {
    it('should create a record with additional metadata');
  });
});
