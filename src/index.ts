import * as http from 'http';
import { ClientRequest } from 'http';
import * as https from 'https';
import * as _ from 'lodash';
import Mitm = require('mitm');
import * as readable from 'readable-stream';
import { YESNO_INTERNAL_HTTP_HEADER } from './consts';
import { RequestSerializer, ResponseSerializer } from './http-serializer';
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
        debug('ClientRequest:onSocket');
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
    const requestId = interceptedRequest.headers[YESNO_INTERNAL_HTTP_HEADER];
    debug('mitm event:request', requestId);

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

    const requestSerializer = new RequestSerializer(
      options, proxiedRequest, interceptedRequest, isHttps,
    );

    (readable as any).pipeline(interceptedRequest, requestSerializer,  proxiedRequest);

    interceptedRequest.on('error', (e: any) => debug('Error on intercepted request:', e));
    interceptedRequest.on('aborted', () => {
      debug('Intercepted request aborted');
      proxiedRequest.abort();
    });

    proxiedRequest.on('timeout', (e: any) => debug('Proxied request timeout', e));
    proxiedRequest.on('error', (e: any) => debug('Proxied request error', e));
    proxiedRequest.on('aborted', () => debug('Proxied request aborted'));
    proxiedRequest.on('response', (proxiedResponse: http.IncomingMessage) => {
      const responseSerializer = new ResponseSerializer(proxiedResponse);
      debug('proxied response (%d)', proxiedResponse.statusCode);
      (readable as any).pipeline(proxiedResponse, responseSerializer, interceptedResponse);

      proxiedResponse.on('end', () => {
        // {
        //   request: requestSerializer.serialize(),
        //   response: responseSerializer.serialize(),
        // }
        debug('response complete');
      });
    });
  }
}
