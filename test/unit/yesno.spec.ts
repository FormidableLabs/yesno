import { expect } from 'chai';
import * as http from 'http';
import * as https from 'https';
import Mitm from 'mitm';
import * as rp from 'request-promise';
import * as url from 'url';

describe('yesno', () => {
  it('should mock requests', (done) => {
    const mitm = Mitm();

    mitm.on('connect', function(socket, opts: any) {
      console.log('connect', opts);
      if (opts.proxying) {
        socket.bypass();
      }
    });

    mitm.on('request', (req: any, res) => {
      // console.log('event:request');
      // req.socket.bypass();
      // res.end('Request end');
      console.log('TO:', req.headers.host, req.url);
      const proxied = https.request({
        host: req.headers.host,
        path: url.parse(req.url).path,
        proxying: true,
      } as any);
      proxied.end();

      proxied.on('response', (pRes) => {
        console.log('Piping response');
        pRes.pipe(res);
      });
      // if (req.body) {
      //   req.body.pipe(proxied);
      //   req.body.on('end', proxied.end.bind(proxied));
      // }

      // proxied.pipe(res);
      // proxied.on('end', res.end.bind(res));
      // req.resume();
      // console.log('Uh', this);
    });

    // const result: rp.RequestPromise = await rp.get('http://www.google.com', {
    //   resolveWithFullResponse: true,
    // });

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
