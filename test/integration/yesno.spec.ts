import { expect } from 'chai';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as rp from 'request-promise';
import { YesNo } from '../../src';
import { SerializedRequestResponse } from '../../src/http-serializer';
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

  after(() => {
    yesno.disable();
  });

  describe('#save', () => {
    it('should create records locally', async () => {
      const name = 'record-test-1';
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

      expect(yesno.intercepted()).to.have.length(2);
      await yesno.save(name);

      const records: SerializedRequestResponse[] = await yesno.load(name);
      expect(records[0]).to.have.nested.property('request.headers.x-timestamp', now);
      expect(records[0]).to.have.nested.property('request.host', 'localhost');
      expect(records[0]).to.have.nested.property('request.path', '/get');
      expect(records[0]).to.have.nested.property('request.query', 'foo=bar');
      expect(records[0]).to.have.nested.property('request.method', 'GET');
      expect(records[0]).to.have.nested.property('response.statusCode', 299);
      expect(records[0]).to.have.nested.property('url', 'http://localhost:3001/get');
    });
  });

  describe('#intercepted', () => {
    it('should allow querying for the various requests made', async () => {
      yesno.spy();

      await rp.get({
        headers: {
          'x-foo': 'bar',
        },
        uri: 'http://localhost:3001/get',
      });

      await rp.post({
        headers: {
          'x-status-code': 500,
        },
        json: true,
        uri: 'http://localhost:3001/post',
      });

      expect(
        await yesno.intercepted(),
        'Returns all intercepted requests by default',
      ).to.have.lengthOf(2);
      expect(await yesno.intercepted(/\/get/), 'Match URL by RegExp').to.have.lengthOf(1);
      expect(
        await yesno.intercepted({ response: { statusCode: 500 } }),
        'Match by a response property',
      ).to.have.lengthOf(1);
      expect(
        await yesno.intercepted({ request: { headers: { 'x-foo': 'bar' } } }),
        'Match by a nested request property',
      ).to.have.lengthOf(1);
      expect(
        await yesno.intercepted({ request: { headers: { 'x-foo': 'bar', 'x-fiz': 'baz' } } }),
        'All properties must match ',
      ).to.have.lengthOf(0);
    });

    it('should treat JSON request or response bodies as objects', async () => {
      await rp.post({
        body: {
          nested: {
            foobar: 'fizbaz',
          },
        },
        json: true,
        uri: 'http://localhost:3001/post',
      });

      await rp.post({
        body: '{ "foo": "bar" }',
        uri: 'http://localhost:3001/post',
      });

      const interceptedJSON = yesno.intercepted()[0];
      const interceptedNotJSON = yesno.intercepted()[1];
      expect(interceptedJSON).to.have.nested.property('request.body.nested.foobar', 'fizbaz');
      expect(interceptedNotJSON, 'Non-json left as a string').to.have.nested.property(
        'request.body',
        '{ "foo": "bar" }',
      );
    });
  });

  describe('#redact', () => {
    it('should allow passing an array of values to redact', async () => {
      await rp.post({
        body: {
          password: 'secret',
          username: 'hulkhoganhero',
        },
        headers: {
          'x-status-code': 500,
        },
        json: true,
        uri: 'http://localhost:3001/post',
      });

      expect(yesno.intercepted()[0]).to.have.nested.property('request.body.password', 'secret');

      yesno.redact(yesno.intercepted(), 'request.body.password');

      expect(yesno.intercepted()[0]).to.have.nested.property('request.body.password', '***');
    });
  });

  describe('mock mode', () => {
    it('should play back the requests from disk', async () => {
      const name = 'mock-test-1';
      yesno.dir = path.join(__dirname, 'mocks');
      await yesno.mock(name);

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

      const records: SerializedRequestResponse[] = await yesno.load(name);
      expect(response1).to.eql(records[0].response.body);
      expect(response2).to.eql(records[1].response.body);
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
