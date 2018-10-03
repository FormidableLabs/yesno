import { expect } from 'chai';
import * as http from 'http';
import * as https from 'https';
import Mitm from 'mitm';
import * as url from 'url';
import * as yesno from '../../src';

describe('yesno', () => {
  it('should mock requests', (done) => {
    yesno.enable();

    const request: http.ClientRequest = https.request({
      host: 'www.google.com',
      path: '/',
    });

    request.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });

    request.on('end', (uh) => {
      console.log('End?', uh);
    });

    request.on('response', (res) => {
      console.log('Response');
      console.log(`STATUS: ${res.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
      res.setEncoding('utf8');
      res.on('data', (chunk: Buffer) => {
        console.log(`BODY: ${chunk}`);
      });
      res.on('end', () => {
        console.log('No more data in response.');
      });
    });

    request.end();
  });
});
