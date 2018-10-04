import * as http from 'http';
import * as https from 'https';
import Mitm = require('mitm');
import { Socket } from 'net';
import * as url from 'url';
const debug = require('debug')('yesno');

interface ProxiedRequestOptions extends http.RequestOptions {
  proxying: boolean;
}

interface ProxiedSocketOptions extends Mitm.SocketOptions {
  proxying: boolean;
}

export default class YesNo {
  private mitm: undefined | Mitm.Mitm;

  public enable(): void {
    debug('Enabling intercept');
    this.mitm = Mitm();
    this.mitm.on('connect', this._mitmOnConnect as Mitm.SocketConnectCallback);
    this.mitm.on('request', this._mitmOnRequest);
  }

  private _mitmOnConnect(
    socket: Mitm.BypassableSocket,
    opts: ProxiedSocketOptions,
  ): void {
    debug('mitm event:connect');
    if (opts.proxying) {
      debug('proxing');
      socket.bypass();
    }
  }

  private _mitmOnRequest(
    req: http.IncomingMessage,
    res: http.ServerResponse,
  ): void {
    debug('mitm event:request');
    const isHttps: boolean = (req.connection as any).encrypted;
    const request = isHttps ? https.request : http.request;
    const proxied: http.ClientRequest = request({
      host: req.headers.host,
      path: url.parse(req.url as string).path,
      proxying: true,
    } as ProxiedRequestOptions);

    proxied.on('response', (proxiedRes: http.IncomingMessage) => {
      debug('proxied response (%d)', proxiedRes.statusCode);
      // res.statusCode = 401;
      // res.write('Foobar');
      // res.end();
      proxiedRes.pipe(res);
    });

    proxied.end();
  }
}
