import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import rp from 'request-promise';
import yesno from '../../src';

describe('Yesno', () => {
  const dir: string = path.join(__dirname, 'tmp');

  describe('#mock', () => {
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

    beforeEach(async () => {
      await yesno.enable().mock('mock-test', path.join(__dirname, 'mocks'));
    });

    afterEach(() => {
      yesno.clear();
    });

    it('should fulfil a matching request', async () => {
      const response = await mockedRequest();
      expect(response).to.eql('mock body');
    });

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

      if (yesno) {
        yesno.disable();
      }
    });

    it('should save intercepted requests in the configured directory', async () => {
      yesno.enable({ dir });

      (yesno as any).interceptedRequestsCompleted = [
        {
          __duration: 1,
          __id: 'foobar',
          __timestamp: 1,
          __version: 'foo',
          request: {
            headers: {},
            host: 'mock.com',
            method: 'GET',
            path: '/',
            port: 80,
            protocol: 'http',
          },
          response: {
            headers: {},
            statusCode: 200,
          },
          url: 'bar',
        },
      ];
      const expectedContents = JSON.stringify({ records: yesno.intercepted() }, null, 2);
      const filename = await yesno.save(name);

      expect(filename, 'Returns the full filename').to.eql(expectedFilename);
      const contents = fs.readFileSync(filename as string).toString();
      expect(contents, 'Contents are JSON').to.eql(expectedContents);
    });

    it('should parse a JSON body');
  });

  describe('#intercepted', () => {
    it('should allow the user to retrieve completed requests by url');
  });
});
