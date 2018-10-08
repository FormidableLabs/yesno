import { expect } from 'chai';
import * as http from 'http';
import * as https from 'https';
import * as rp from 'request-promise';
import Yesno from '../../src';
import * as testServer from '../server';

describe('yesno', () => {
  const TEST_HEADER_VALUE = 'foo';
  const TEST_BODY_VALUE = 'fiz';

  before(() => {
    const yesno: Yesno = new Yesno();
    yesno.enable();
  });

  it('should send get to test server', async () => {
    await testServer.start();

    const response: rp.RequestPromise = await rp.get({
      headers: {
        'x-test-header': TEST_HEADER_VALUE,
      },
      json: true,
      uri: 'http://localhost:3001/get',
    });

    expect(response, 'Missing response').to.be.ok;
    expect(response).to.have.nested.property(
      'headers.x-test-header',
      TEST_HEADER_VALUE,
    );
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
    expect(response).to.have.nested.property(
      'headers.x-test-header',
      TEST_HEADER_VALUE,
    );
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
    expect(response).to.have.nested.property(
      'headers.x-test-header',
      TEST_HEADER_VALUE,
    );
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
