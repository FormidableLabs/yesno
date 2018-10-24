import { expect } from 'chai';
import { on } from 'cluster';
import * as fs from 'fs';
import * as path from 'path';
import rp from 'request-promise';
import yesno from '../../src';
import * as testServer from '../test-server';
const net = require('net');

describe('Yesno', () => {
  const dir: string = path.join(__dirname, 'tmp');
  const mocksDir = path.join(__dirname, 'mocks');
  let server: testServer.ITestServer;

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
    yesno.disable();
  });

  after(() => {
    server.close();
  });

  describe.skip('#enable', () => {
    it('should not mock TCP connections', (done) => {
      yesno.enable();
      requestTestServer();
      const socket = net.connect({ host: 'google.com', port: 80 });
      socket.write('foo!');
      socket.on('error', done);
      socket.on('data', (data: any) => {
        done();
      });
    });
  });

  describe('#disable', () => {
    it('should restore normal HTTP functionality after mocking', async () => {
      const startingRequestCount = server.getRequestCount();
      await requestTestServer();
      expect(server.getRequestCount(), 'Unmocked').to.eql(startingRequestCount + 1);

      await yesno
        .enable({ ports: [3001] })
        .mock()
        .load('mock-localhost-get', mocksDir);
      await requestTestServer();
      expect(server.getRequestCount(), 'Mocked').to.eql(startingRequestCount + 1);

      yesno.disable();
      await requestTestServer();
      expect(server.getRequestCount(), 'Unmocked again').to.eql(startingRequestCount + 2);

      await yesno
        .enable({ ports: [3001] })
        .mock()
        .load('mock-localhost-get', mocksDir);
      await requestTestServer();
      expect(server.getRequestCount(), 'Mocked again').to.eql(startingRequestCount + 2);
    });
  });

  describe('#mock', () => {
    beforeEach(async () => {
      await yesno
        .enable({ ports: [3001], dir: mocksDir })
        .mock()
        .load('mock-test');
    });

    afterEach(() => {
      yesno.clear();
    });

    it('should fulfil a matching request', async () => {
      const response = await mockedRequest();
      expect(response).to.eql('mock body');
    });

    it('should allow providing mocks', async () => {
      yesno.mock([
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
      ]);

      expect(yesno.intercepted()).to.have.lengthOf(0);
      const response = await requestTestServer();
      expect(response).to.eql('foobar');
      expect(yesno.intercepted()).to.have.lengthOf(1);
    });

    it('should allow providing mocks with JSON response bodies as objects', async () => {
      yesno.mock([
        {
          request: {
            host: 'localhost',
            method: 'GET',
            path: '/get',
            port: 3001,
            protocol: 'http',
          },
          response: {
            body: { foo: 'bar' },
            statusCode: 200,
          },
        },
      ]);

      expect(yesno.intercepted()).to.have.lengthOf(0);
      const response = await requestTestServer({ json: true });
      expect(response).to.eql({ foo: 'bar' });
      expect(yesno.intercepted()).to.have.lengthOf(1);
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

      yesno.disable();
    });

    it('should save intercepted requests in the configured directory', async () => {
      yesno.enable({ dir }).spy();

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
