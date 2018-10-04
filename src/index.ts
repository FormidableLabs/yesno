import * as http from 'http';
import * as https from 'https';
import Mitm from 'mitm';
import { TLSSocket } from 'tls';
import * as url from 'url';
const debug = require('debug')('yesno');

interface InterfaceProxiedRequestOptions extends http.RequestOptions {
  proxying: boolean;
}

export function enable(): void {
  debug('Enabling intercept');
  const mitm = Mitm();

  mitm.on('connect', (socket, opts: any) => {
    // const isTls: boolean = socket instanceof TLSSocket;
    debug('Connect event');
    if (opts.proxying) {
      debug('Enabling proxy.');
      socket.bypass();
    }
  });

  mitm.on('request', (req: http.IncomingMessage, res: http.ServerResponse) => {
    const isHttps: boolean = (req.connection as any).encrypted;
    const request = isHttps ? https.request : http.request;
    const proxied: http.ClientRequest = request({
      host: req.headers.host,
      path: url.parse(req.url as string).path,
      proxying: true,
    } as InterfaceProxiedRequestOptions);

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
