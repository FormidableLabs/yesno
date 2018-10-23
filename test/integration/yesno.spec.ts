import { expect } from 'chai';
import * as http from 'http';
import * as https from 'https';
import * as _ from 'lodash';
import * as path from 'path';
import * as rp from 'request-promise';
import yesno from '../../src';
import { SerializedRequestResponse } from '../../src/http-serializer';
import * as testServer from '../test-server';

describe('yesno', () => {
  const TEST_HEADER_VALUE = 'foo';
  const TEST_BODY_VALUE = 'fiz';
  let server: http.Server;

  before(async () => {
    server = await testServer.start();

    yesno.enable({ dir: path.join(__dirname, 'tmp') });
  });

  afterEach(() => {
    yesno.clear();
  });

  after(() => {
    yesno.disable();
    server.close();
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

      const mocks: SerializedRequestResponse[] = await yesno.mock(name);
      expect(mocks[0]).to.have.nested.property('request.headers.x-timestamp', now);
      expect(mocks[0]).to.have.nested.property('request.host', 'localhost');
      expect(mocks[0]).to.have.nested.property('request.path', '/get');
      expect(mocks[0]).to.have.nested.property('request.query', 'foo=bar');
      expect(mocks[0]).to.have.nested.property('request.method', 'GET');
      expect(mocks[0]).to.have.nested.property('response.statusCode', 299);
      expect(mocks[0]).to.have.nested.property('url', 'http://localhost:3001/get');
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

      expect(yesno.intercepted(), 'Returns all intercepted requests').to.have.lengthOf(2);
      expect(yesno.matching(/\/get/).intercepted(), 'Match URL by RegExp').to.have.lengthOf(1);
      expect(
        yesno.matching({ response: { statusCode: 500 } }).intercepted(),
        'Match by a response property',
      ).to.have.lengthOf(1);
      expect(
        yesno.matching({ request: { headers: { 'x-foo': 'bar' } } }).intercepted(),
        'Match by a nested request property',
      ).to.have.lengthOf(1);
      expect(
        yesno.matching({ request: { headers: { 'x-foo': 'bar', 'x-fiz': 'baz' } } }).intercepted(),
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
    it('should allow redacting a single nested property', async () => {
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

      const toRedact = 'request.body.password';
      const intercepted = yesno.intercepted();
      expect(intercepted[0]).to.have.nested.property(toRedact, 'secret');
      yesno.redact(toRedact);

      expect(yesno.intercepted()[0]).to.have.nested.property(toRedact, '*****');
      expect(
        _.omit(yesno.intercepted()[0], toRedact),
        'Non matching properties are unchanged',
      ).to.eql(_.omit(intercepted[0], toRedact));
      expect(intercepted[0], 'The intercepted requests are not mutated').to.have.nested.property(
        toRedact,
        'secret',
      );
    });

    // it('should allow new syntax', () => {
    //   // yesno.matching(query: IQuery): IQueryBuilder => {}
    //   yesno.matching(query).redact('request.body.foobar');
    //   yesno.matching(query).intercepted(); // Replace yesno.intercepte()?
    //   yesno.matching(query).mocks();
    // });
  });

  describe('mock mode', () => {
    it('should play back the requests from disk', async () => {
      const name = 'mock-test-1';
      const mocks = await yesno.mock(name, path.join(__dirname, 'mocks'));

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

      expect(response1).to.eql(mocks[0].response.body);
      expect(response2).to.eql(mocks[1].response.body);
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
