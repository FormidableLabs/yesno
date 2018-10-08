import * as http from 'http';
import { ClientRequest } from 'http';
import * as https from 'https';
import * as _ from 'lodash';
import Mitm = require('mitm');
import { Socket } from 'net';
import * as url from 'url';
import { createProxiedRequest } from './proxy';
import YesNoClientRequest from './spy';
const httpModule = require('http');
const debug = require('debug')('yesno');

interface ProxiedSocketOptions extends http.RequestOptions {
  proxying?: boolean;
}

export enum Mode {
  Record,
  Mock,
  Live,
}
export interface YesNoOptions {
  mode: Mode;
}

interface RegisteredSocket extends Mitm.BypassableSocket {
  __yesno_req_id?: string;
}

let clientRequestId: number = 0;
const YESNO_INTERNAL_HTTP_HEADER: string = 'x-yesno-internal-header';
const clientRequests: { [key: string]: http.RequestOptions } = {};

function setOptions(socket: RegisteredSocket, options: ProxiedSocketOptions): void {
  socket.__yesno_req_id = String(clientRequestId);
  clientRequests[clientRequestId] = options;

  clientRequestId++;
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

    ClientRequest.prototype.onSocket = _.flowRight(
      ClientRequest.prototype.onSocket,
      // tslint:disable-next-line:only-arrow-functions
      function(this: ClientRequest, socket: RegisteredSocket): RegisteredSocket {
        if (undefined !== socket.__yesno_req_id) {
          // Give precedence to the parsed path
          clientRequests[socket.__yesno_req_id].path = (this as any).path;
          this.setHeader(YESNO_INTERNAL_HTTP_HEADER, socket.__yesno_req_id);
        }

        return socket;
      },
    );
    this.mitm = Mitm();

    this.mitm.on('connect', this._mitmOnConnect as Mitm.SocketConnectCallback);
    this.mitm.on('request', this._mitmOnRequest);
  }

  private _mitmOnConnect(
    socket: Mitm.BypassableSocket,
    options: ProxiedSocketOptions,
  ): void {
    debug('mitm event:connect');

    if (options.proxying) {
      debug('proxying');
      socket.bypass();
    } else {
      setOptions(socket as RegisteredSocket, options);
      debug('socket id', (socket as RegisteredSocket).__yesno_req_id);
    }
  }

  private _mitmOnRequest(
    interceptedRequest: http.IncomingMessage,
    interceptedResponse: http.ServerResponse,
  ): void {
    debug('mitm event:request', interceptedRequest.headers[YESNO_INTERNAL_HTTP_HEADER]);

    if (!interceptedRequest.headers[YESNO_INTERNAL_HTTP_HEADER]) {
      debug('Error: Missing internal header');
      throw new Error('Missing internal header');
    }

    const id: string = interceptedRequest.headers[YESNO_INTERNAL_HTTP_HEADER] as string;
    const options: http.RequestOptions = clientRequests[id];

    if (!options) {
      debug(`Error: Missing client options for yesno req ${id}`);
      throw new Error(`Missing client options for yesno req ${id}`);
    }

    const isHttps: boolean = (interceptedRequest.connection as any).encrypted;
    const request = isHttps ? https.request : http.request;
    const proxiedRequest: http.ClientRequest = request({
      ...options,
      proxying: true,
    } as ProxiedSocketOptions);

    // Listen to events
    interceptedRequest.on('error', (e: any) =>
      debug('Error on intercepted request:', e),
    );
    interceptedRequest.on('aborted', () => {
      debug('Intercepted request aborted');
      proxiedRequest.abort();
    });
    interceptedRequest.on('end', () => debug('Intercepted request ended'));
    proxiedRequest.on('timeout', (e: any) =>
      debug('Proxied request timeout', e),
    );
    // tslint:disable-next-line:max-line-length
    // Add error handling from https://github.com/nodejitsu/node-http-proxy/blob/a3fe02d651d05d02d0ced377c22ae8345a2435a4/lib/http-proxy/passes/web-incoming.js#L155
    proxiedRequest.on('error', (e: any) => debug('Proxied request error', e));
    proxiedRequest.on('aborted', () => {
      debug('Proxied request aborted');
    });
    proxiedRequest.on('end', () => debug('Proxied request end'));

    // Add the body
    interceptedRequest.pipe(proxiedRequest);
    interceptedRequest.on('data', (data: Buffer) => {
      debug('Writing', data.toString());
      proxiedRequest.write(data);
    });

    // tslint:disable-next-line:max-line-length
    // @todo Use https://github.com/nodejitsu/node-http-proxy/blob/master/lib/http-proxy/passes/web-incoming.js#L173
    proxiedRequest.on('response', (proxiedResponse: http.IncomingMessage) => {
      debug('proxied response (%d)', proxiedResponse.statusCode);
      proxiedResponse.pipe(
        interceptedResponse,
        { end: true },
      );
      proxiedResponse.on('data', (d: any) => console.log('Data', d.toString()));
      interceptedResponse.on('finish', () =>
        debug('Intercepted response finished'),
      );
    });

    proxiedRequest.end();
  }
}
