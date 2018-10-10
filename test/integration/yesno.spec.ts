import { expect } from 'chai';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as rp from 'request-promise';
import { ISaveFile, Mode, YesNo } from '../../src';
import * as testServer from '../server';

describe('yesno', () => {
  const TEST_HEADER_VALUE = 'foo';
  const TEST_BODY_VALUE = 'fiz';
  let yesno: YesNo;

  before(async () => {
    await testServer.start();

    yesno = new YesNo({ dir: path.join(__dirname, 'tmp') });
    yesno.enable();
  });

  afterEach(() => {
    yesno.clear();
  });

  describe('record mode', () => {
    it('should create records locally', async () => {
      const name = 'record-test-1';
      yesno.begin(name, Mode.Record);
      const now = Date.now();

      await rp.get({
        headers: {
          'x-status-code': 299,
          'x-timestamp': now,
        },
        uri: 'http://localhost:3001/get?foo=bar',
      });
      await rp.post({
        body: {
          foo: 'bar',
        },
        json: true,
        uri: 'http://localhost:3001/post',
      });

      await yesno.save();

      const { records }: ISaveFile = require(yesno.getMockFilename(name));
      expect(records[0]).to.have.nested.property('request.headers.x-timestamp', now);
      expect(records[0]).to.have.nested.property('request.host', 'localhost');
      expect(records[0]).to.have.nested.property('request.path', '/get');
      expect(records[0]).to.have.nested.property('request.query', 'foo=bar');
      expect(records[0]).to.have.nested.property('request.method', 'GET');
      expect(records[0]).to.have.nested.property('response.statusCode', 299);
      expect(records[0]).to.have.nested.property('url', 'http://localhost:3001/get');
    });
  });

  describe('mock mode', () => {
    it('should play back the requests from disk', async () => {
      const name = 'mock-test-1';
      await yesno.useDir(path.join(__dirname, 'mocks')).begin(name, Mode.Mock);
      const now = Date.now();

      const response1 = await rp.get({
        headers: {
          'x-status-code': 299,
          'x-timestamp': now,
        },
        uri: 'http://localhost:3001/get?foo=bar',
      });
      const response2 = await rp.post({
        body: {
          foo: 'bar',
        },
        json: true,
        uri: 'http://localhost:3001/post',
      });

      const { records }: ISaveFile = require(yesno.getMockFilename(name));
      expect(response1).to.eql(records[0].response.body);
      expect(response2).to.eql(records[1].response.body);

      await yesno.save();
    });
  });

  it('should send get to test server', async () => {
    const response: rp.RequestPromise = await rp.get({
      headers: {
        'x-test-header': TEST_HEADER_VALUE,
      },
      json: true,
      qs: {
        fiz: 'baz',
      },
      uri: 'http://localhost:3001/get',
    });

    expect(response, 'Missing response').to.be.ok;
    expect(response).to.have.nested.property('headers.x-test-header', TEST_HEADER_VALUE);
  });

  it('should proxy HTTP GET requests', async () => {
    const response: rp.RequestPromise = await rp.get({
      headers: {
        'x-test-header': TEST_HEADER_VALUE,
      },
      json: true,
      uri: 'http://postman-echo.com/get',
    });

    expect(response, 'Missing response').to.be.ok;
    expect(response).to.have.nested.property('headers.x-test-header', TEST_HEADER_VALUE);
  });

  it('should proxy HTTP POST requests', async () => {
    const response: rp.RequestPromise = await rp.post({
      body: {
        test: TEST_BODY_VALUE,
      },
      headers: {
        'x-test-header': TEST_HEADER_VALUE,
      },
      json: true,
      uri: 'https://postman-echo.com/post',
    });

    expect(response, 'Missing response').to.be.ok;
    expect(response).to.have.nested.property('headers.x-test-header', TEST_HEADER_VALUE);
    expect(response).to.have.nested.property('json.test', TEST_BODY_VALUE);
  });

  it('should mock HTTPS requests', (done) => {
    const request: http.ClientRequest = https.request({
      headers: {
        accept: 'application/json',
        connection: 'close',
        'content-type': 'application/json',
        host: 'postman-echo.com',
        'x-test-header': 'foo',
      },
      host: 'postman-echo.com',
      path: '/get',
    });

    request.on('error', (e) => {
      // console.error(`problem with request: ${e.message}`);
    });

    request.on('end', (uh) => {
      // console.log('End?', uh);
    });

    request.on('response', (res) => {
      // console.log('Response');
      // console.log(`STATUS: ${res.statusCode}`);
      // console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk: Buffer) => {
        // console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        // console.log('No more data in response.');
        done();
      });
    });

    request.end();
  });
});
