import * as http from 'http';
import * as https from 'https';
import Mitm from 'mitm';
import * as url from 'url';
const debug = require('debug')('yesno');

export function enable(): void {
  debug('Enabling intercept');
  const mitm = Mitm();

  mitm.on('connect', (socket, opts: any) => {
    debug('Connect event');
    if (opts.proxying) {
      debug('Enabling proxy.');
      socket.bypass();
    }
  });

  mitm.on('request', (req: any, res) => {
    debug('Request', req.headers.host, req.url);
    const proxied: http.ClientRequest = https.request({
      host: req.headers.host,
      path: url.parse(req.url).path,
      proxying: true,
    } as any);

    proxied.on('response', (pRes: http.IncomingMessage) => {
      debug('Response');
      // res.statusCode = 401;
      // res.write('Foobar');
      // res.end();
      pRes.pipe(res);
    });

    proxied.end();
  });
}
