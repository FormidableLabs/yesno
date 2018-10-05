import { expect } from 'chai';
import * as http from 'http';
import * as https from 'https';
import * as rp from 'request-promise';
import Yesno from '../../src';

describe('yesno', () => {
  before(() => {
    const yesno: Yesno = new Yesno();
    yesno.enable();
  });

  it('should mock HTTP requests', async () => {
    const testHeaderValue = 'foo';
    const response: rp.RequestPromise = await rp.get({
      body: {
        test: 'value',
      },
      headers: {
        'x-test-header': testHeaderValue,
      },
      json: true,
      uri: 'https://postman-echo.com/get',
    });

    expect(response).to.be.ok;
    expect(response).to.have.nested.property(
      'headers.x-test-header',
      testHeaderValue,
    );
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
