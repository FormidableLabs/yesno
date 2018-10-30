import { expect } from 'chai';
import * as fs from 'fs';
import _ from 'lodash';
import * as path from 'path';
import rp from 'request-promise';
import * as sinon from 'sinon';
import yesno from '../../src';
import { IHttpMock } from '../../src/file';
import * as testServer from '../test-server';

type PartialDeep<T> = { [P in keyof T]?: PartialDeep<T[P]> };

describe('Yesno', () => {
  const dir: string = path.join(__dirname, 'tmp');
  const mocksDir = path.join(__dirname, 'mocks');
  let server: testServer.ITestServer;

  afterEach(() => {
    sinon.restore();
  });

  function requestTestServer(options: object = {}) {
    return rp({
      method: 'GET',
      uri: 'http://localhost:3001/get',
      ...options,
    });
  }

  function mockedRequest(options: object = {}) {
    return rp({
      headers: {
        'x-fiz': 'baz',
      },
      method: 'POST',
      uri: 'http://example.com/my/path',
      ...options,
    });
  }

  before(async () => {
    server = await testServer.start();
  });

  afterEach(() => {
    yesno.restore();
  });

  after(() => {
    server.close();
  });

  describe('#restore', () => {
    it('should restore normal HTTP functionality after mocking', async () => {
      const startingRequestCount = server.getRequestCount();
      await requestTestServer();
      expect(server.getRequestCount(), 'Unmocked').to.eql(startingRequestCount + 1);

      yesno.mock(await yesno.load('mock-localhost-get', mocksDir), { ports: [3001] });
      await requestTestServer();
      expect(server.getRequestCount(), 'Mocked').to.eql(startingRequestCount + 1);

      yesno.restore();
      await requestTestServer();
      expect(server.getRequestCount(), 'Unmocked again').to.eql(startingRequestCount + 2);

      await yesno.mock(await yesno.load('mock-localhost-get', mocksDir), { ports: [3001] });
      await requestTestServer();
      expect(server.getRequestCount(), 'Mocked again').to.eql(startingRequestCount + 2);
    });
  });

  describe('#spy', () => {
    it('should enable the interceptor');
    it('should give us access to intercepted requests');
    it('should handle timeouts');
    it('should handle invalid SSL');
    it('should support application/json');
    it('should support application/x-www-form-url-encoded');

    it('should support multipart/form-data', async () => {
      yesno.spy({ ports: [3001] });

      await rp({
        formData: {
          fooBuffer: Buffer.from('foo-buffer'),
          fooString: 'foobar-string',
        },
        method: 'POST',
        uri: 'http://localhost:3001/post',
      });

      const intercepted = yesno.intercepted();
      expect(intercepted).to.have.lengthOf(1);
      expect(intercepted[0].request.body).to.match(
        /Content-Disposition: form-data; name="fooString"\s+foobar-string/,
      );
      expect(intercepted[0].request.body).to.match(
        /Content-Disposition: form-data; name="fooBuffer"\s+Content-Type: application\/octet-stream\s+foo-buffer/,
      );
    });

    it('should support binary');
  });

  describe('#mock', () => {
    function createMock(options: PartialDeep<IHttpMock> = {}): IHttpMock {
      return _.merge(
        {
          request: {
            host: 'localhost',
            method: 'GET',
            path: '/get',
            port: 3001,
            protocol: 'http',
          },
          response: {
            body: 'foobar',
            statusCode: 200,
          },
        },
        options,
      ) as IHttpMock;
    }
    beforeEach(async () => {
      await yesno.mock(await yesno.load('mock-test', mocksDir), { ports: [3001] });
    });

    afterEach(() => {
      yesno.clear();
    });

    it('should fulfil a matching request', async () => {
      const response = await mockedRequest();
      expect(response).to.eql('mock body');
    });

    it('should allow providing mocks', async () => {
      yesno.mock([createMock()]);

      expect(yesno.intercepted()).to.have.lengthOf(0);
      const response = await requestTestServer();
      expect(response).to.eql('foobar');
      expect(yesno.intercepted()).to.have.lengthOf(1);
    });

    it('should replace the mocks on subsequent calls but preserve existing intercepted requests');

    it('should throw an error if a mock shape is invalid', () => {
      const mocks = [createMock(), createMock()];
      (mocks[0] as any).request.host = undefined;

      expect(() => yesno.mock(mocks)).to.throw(
        'YesNo: Invalid serialized HTTP. (Errors: Expecting Readonly<string> at 0.request.host but instead got: undefined.)',
      );
    });

    it('should allow providing mocks with JSON response bodies as objects', async () => {
      yesno.mock([
        createMock({
          response: {
            body: { foo: 'bar' },
          },
        }),
      ]);

      expect(yesno.intercepted()).to.have.lengthOf(0);
      expect(await requestTestServer({ json: true })).to.eql({ foo: 'bar' });
      expect(yesno.intercepted()).to.have.lengthOf(1);
    });

    it('should reject a request for which no mock has been provided');
    it('should handle unexpected errors');

    it('should reject for host mismatch', async () => {
      await expect(mockedRequest({ uri: 'http://foobar.com/my/path' })).to.be.rejectedWith(
        /YesNo: Request does not match mock. Expected host "example.com" for request #0, received "foobar.com"/,
      );
    });

    it('should reject for method mismatch', async () => {
      await expect(mockedRequest({ method: 'GET' })).to.be.rejectedWith(
        /YesNo: Request does not match mock. Expected request #0 for example.com to HTTP method "POST", not "GET"/,
      );
    });

    it('should reject for HTTP protocol mismatch', async () => {
      await expect(mockedRequest({ uri: 'https://example.com/my/path' })).to.be.rejectedWith(
        /YesNo: Request does not match mock. Expected request #0 for example.com to use "http" protocol, not "https"/,
      );
    });

    it('should reject for port mismatch', async () => {
      await expect(mockedRequest({ uri: 'http://example.com:443/my/path' })).to.be.rejectedWith(
        /YesNo: Request does not match mock. Expected request #0 for example.com to be served on port "80", not "443"/,
      );
    });

    it('should reject for path mismatch', async () => {
      await expect(mockedRequest({ uri: 'http://example.com/my/foobar' })).to.be.rejectedWith(
        /Request does not match mock. Expected request #0 "POST http:\/\/example.com:80" to have path "\/my\/path", not "\/my\/foobar"/,
      );
    });
  });

  describe('#save', () => {
    const name = 'mock-save';
    const expectedFilename = path.join(dir, `${name}-yesno.json`);

    afterEach(() => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(dir, file));
      });

      yesno.restore();
    });

    it('should save intercepted requests');
    it('should throw an error if there are any in flight requests');
    it('should take no action in mock mode (if not provided requests)');
    it('should allow setting the full filename');
    it('should allow providing the records');
  });

  describe('#load', () => {
    it('should load serialized requests by name & dir');
    it('should load serialized requests by filename');
    it('should support application/json');
    it('should support x-www-form-url-encoded');
    it('should support binary');
    it('should support form-data');
    it('should throw an error if a record is not formatted correctly');
  });

  describe('#intercepted', () => {
    it('should call FilteredHttpCollection#intercepted() with no query');
  });

  describe('#mocks', () => {
    it('should call FilteredHttpCollection#mocks() with no query');
  });

  describe('#redact', () => {
    it('should call FilteredHttpCollection#redact() with no query');
  });
});
