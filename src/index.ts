import * as http from 'http';
import * as https from 'https';
import Mitm = require('mitm');
import * as url from 'url';
const debug = require('debug')('yesno');

interface ProxiedRequestOptions extends http.RequestOptions {
  proxying: boolean;
}

interface ProxiedSocketOptions extends Mitm.SocketOptions {
  proxying: boolean;
}

export enum Mode {
  Record,
  Mock,
  Live,
}
export interface YesNoOptions {
  mode: Mode;
}

export default class YesNo {
  private mitm: undefined | Mitm.Mitm;
  private mode: Mode;

  constructor(options?: YesNoOptions) {
    const { mode = Mode.Live } = options || {};
    this.mode = mode;
  }

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
    clientRequest: http.IncomingMessage,
    clientResponse: http.ServerResponse,
  ): void {
    debug('mitm event:request');
    // tslint:disable-next-line:max-line-length
    // @todo Replicate some logic from https://github.com/nodejitsu/node-http-proxy/blob/master/lib/http-proxy/passes/web-incoming.js#L100
    const isHttps: boolean = (clientRequest.connection as any).encrypted;
    const request = isHttps ? https.request : http.request;

    // @todo Use `node-http-proxy.common.setupOutgoing`
    const proxiedRequest: http.ClientRequest = request({
      host: clientRequest.headers.host,
      path: url.parse(clientRequest.url as string).path,
      proxying: true,
    } as ProxiedRequestOptions);

    clientRequest.pipe(
      proxiedRequest,
      { end: true },
    );

    // tslint:disable-next-line:max-line-length
    // @todo Use https://github.com/nodejitsu/node-http-proxy/blob/master/lib/http-proxy/passes/web-incoming.js#L173
    proxiedRequest.on('response', (proxiedResponse: http.IncomingMessage) => {
      debug('proxied response (%d)', proxiedResponse.statusCode);
      // res.statusCode = 401;
      // res.write('Foobar');
      // res.end();
      proxiedResponse.pipe(clientResponse);
    });

    proxiedRequest.end();
  }
}
