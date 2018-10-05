import * as http from 'http';
import Mitm = require('mitm');
import { createProxiedRequest } from './proxy';
const debug = require('debug')('yesno');

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
      debug('proxying');
      socket.bypass();
    }
  }

  private _mitmOnRequest(
    interceptedRequest: http.IncomingMessage,
    interceptedResponse: http.ServerResponse,
  ): void {
    debug('mitm event:request');
    const proxiedRequest: http.ClientRequest = createProxiedRequest(
      interceptedRequest,
    );

    interceptedRequest.on('error', (e: any) =>
      debug('Error on intercepted request:', e),
    );
    interceptedRequest.on('aborted', () => {
      debug('Intercepted request aborted');
      proxiedRequest.abort();
    });
    proxiedRequest.on('timeout', (e: any) =>
      debug('Proxied request timeout', e),
    );
    proxiedRequest.on('error', (e: any) => debug('Proxied request error', e));
    proxiedRequest.on('aborted', () => {
      debug('Proxied request aborted');
    });

    // Add the body
    // interceptedRequest.pipe(
    //   proxiedRequest,
    //   { end: true },
    // );
    // proxiedRequest.write('foo');
    proxiedRequest.end();

    // tslint:disable-next-line:max-line-length
    // @todo Use https://github.com/nodejitsu/node-http-proxy/blob/master/lib/http-proxy/passes/web-incoming.js#L173
    proxiedRequest.on('response', (proxiedResponse: http.IncomingMessage) => {
      debug('proxied response (%d)', proxiedResponse.statusCode);
      proxiedResponse.pipe(
        interceptedResponse,
        { end: true },
      );
      // proxiedResponse.on('data', (d: any) => console.log('Data', d.toString()));
      interceptedResponse.on('finish', () =>
        debug('Intercepted response finished'),
      );
    });

    proxiedRequest.end();
  }
}
