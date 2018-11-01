import { IDebugger } from 'debug';
import { EventEmitter } from 'events';
import * as http from 'http';
import { ClientRequest } from 'http';
import * as https from 'https';
import * as _ from 'lodash';
import Mitm from 'mitm';
import { Socket } from 'net';
import * as readable from 'readable-stream';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_PORT_HTTP, DEFAULT_PORT_HTTPS, YESNO_INTERNAL_HTTP_HEADER } from './consts';
import { ClientRequestFull, RequestSerializer, ResponseSerializer } from './http-serializer';

const debug: IDebugger = require('debug')('yesno:proxy');

interface ClientRequestTracker {
  [key: string]: {
    clientOptions: http.RequestOptions;
    clientRequest?: ClientRequestFull;
  };
}

interface RegisteredSocket extends Mitm.BypassableSocket {
  __yesno_req_id?: string;
}

interface ProxyRequestOptions extends http.RequestOptions {
  proxying?: boolean;
}

export interface IInterceptEvent {
  clientRequest: http.ClientRequest;
  interceptedRequest: http.IncomingMessage;
  interceptedResponse: http.ServerResponse;
  requestNumber: number;
  requestSerializer: RequestSerializer;
}

export interface IInterceptOptions {
  ignorePorts?: number[];
}

export interface IProxiedEvent {
  requestSerializer: RequestSerializer;
  responseSerializer: ResponseSerializer;
  requestNumber: number;
}

interface IInterceptEvents {
  on(event: 'intercept', listener: (event: IInterceptEvent) => void): this;
  on(event: 'proxied', listener: (event: IProxiedEvent) => void): this;
}

export default class Interceptor extends EventEmitter implements IInterceptEvents {
  public requestNumber: number = 0;
  private shouldProxy: boolean = true;
  private clientRequests: ClientRequestTracker = {};
  private mitm?: Mitm.Mitm;
  private origOnSocket?: (socket: Socket) => void;
  private ignorePorts: number[] = [];

  /**
   * Begin intercepting requests on instantiation
   */
  constructor(options?: { shouldProxy: boolean }) {
    super();
    const { shouldProxy = true } = options || {};
    this.shouldProxy = shouldProxy;
  }

  public proxy(shouldProxy: boolean): void {
    this.shouldProxy = shouldProxy;
  }

  public enable(options: IInterceptOptions = {}): void {
    if (this.mitm || this.origOnSocket) {
      debug('Interceptor already enabled. Do nothing.');
      return;
    }

    const self = this;
    this.mitm = Mitm();
    this.ignorePorts = options.ignorePorts || [];
    this.origOnSocket = ClientRequest.prototype.onSocket;

    ClientRequest.prototype.onSocket = _.flowRight(
      this.origOnSocket,
      // tslint:disable-next-line:only-arrow-functions
      function(this: ClientRequestFull, socket: RegisteredSocket): RegisteredSocket {
        if (undefined !== socket.__yesno_req_id) {
          debug('New socket on client request', socket.__yesno_req_id);
          self.clientRequests[socket.__yesno_req_id].clientRequest = this;
          this.setHeader(YESNO_INTERNAL_HTTP_HEADER, socket.__yesno_req_id);
        }

        return socket;
      },
    );

    this.mitm.on('connect', this.mitmOnConnect.bind(this) as Mitm.SocketConnectCallback);
    this.mitm.on('request', this.mitmOnRequest.bind(this));
    this.mitm.on('connection', (server) => {
      server.on('error', (err) => debug('Server error:', err));
    });
  }

  /**
   * Disable request interception
   */
  public disable() {
    if (!this.mitm || !this.origOnSocket) {
      debug('Interceptor already disabled. Do nothing.');
      return;
    }

    ClientRequest.prototype.onSocket = this.origOnSocket;
    this.mitm.disable();
    this.mitm = undefined;
    this.origOnSocket = undefined;
  }

  /**
   * Event handler for Mitm "connect" event.
   */
  private mitmOnConnect(socket: Mitm.BypassableSocket, options: ProxyRequestOptions): void {
    debug('New socket connection');
    const { port } = options;

    if (this.ignorePorts && -1 !== this.ignorePorts.indexOf(parseInt(String(port), 10))) {
      debug('Ignoring socket on port %d', port);
      socket.bypass();
      return;
    }

    if (options.proxying) {
      debug('Bypassing intercept...');
      socket.bypass();
    } else {
      this.trackSocketAndClientOptions(socket as RegisteredSocket, options);
      debug('Tracking socket %s', (socket as RegisteredSocket).__yesno_req_id);
    }
  }

  /**
   * Event handler for Mitm "request" event.
   *
   * Intercepted requests will be proxied if the `shouldProxy` option has been set.
   * @emits 'intercept' when we intercept a request
   * @emits 'proxied' when we have sent the response for a proxied response
   */
  private mitmOnRequest(
    interceptedRequest: http.IncomingMessage,
    interceptedResponse: http.ServerResponse,
  ): void {
    debug('mitm event:request');

    const id = this.getRequestId(interceptedRequest);

    function debugReq(formatter: string, ...args: any[]): void {
      debug(`[id:${id}] ${formatter}`, ...args);
    }

    if (!this.clientRequests[id]) {
      debugReq(`Error: Missing client options for yesno req ${id}`);
      throw new Error(`Missing client options for yesno req ${id}`);
    }

    const { clientOptions } = this.clientRequests[id];
    const clientRequest = this.clientRequests[id].clientRequest as ClientRequestFull;
    const isHttps: boolean = (interceptedRequest.connection as any).encrypted;
    const requestSerializer = new RequestSerializer(
      clientOptions,
      clientRequest,
      interceptedRequest,
      isHttps,
    );
    const requestNumber = this.requestNumber;
    this.requestNumber++;

    debugReq('Emitting "intercept"');
    this.emit('intercept', {
      clientRequest,
      interceptedRequest,
      interceptedResponse,
      requestNumber,
      requestSerializer,
    } as IInterceptEvent);

    if (!this.shouldProxy) {
      return;
    }

    const request = isHttps ? https.request : http.request;
    const proxiedRequest: http.ClientRequest = request({
      ...clientOptions,
      headers: _.omit(clientRequest.getHeaders(), YESNO_INTERNAL_HTTP_HEADER),
      path: (clientRequest as ClientRequestFull).path,
      proxying: true,
    } as ProxyRequestOptions);

    (readable as any).pipeline(interceptedRequest, requestSerializer, proxiedRequest);

    interceptedRequest.on('error', (e: any) => debugReq('Error on intercepted request:', e));
    interceptedRequest.on('aborted', () => {
      debugReq('Intercepted request aborted');
      proxiedRequest.abort();
    });

    proxiedRequest.on('timeout', (e: any) => debugReq('Proxied request timeout', e));
    proxiedRequest.on('error', (e: any) => debugReq('Proxied request error', e));
    proxiedRequest.on('aborted', () => debugReq('Proxied request aborted'));
    proxiedRequest.on('response', (proxiedResponse: http.IncomingMessage) => {
      const responseSerializer = new ResponseSerializer(proxiedResponse);
      debugReq('proxied response (%d)', proxiedResponse.statusCode);
      (readable as any).pipeline(proxiedResponse, responseSerializer, interceptedResponse);

      proxiedResponse.on('end', () => {
        debugReq('Emitting "proxied"');
        this.emit('proxied', {
          requestNumber,
          requestSerializer,
          responseSerializer,
        });
      });
    });
  }

  private trackSocketAndClientOptions(
    socket: RegisteredSocket,
    clientOptions: ProxyRequestOptions,
  ): void {
    socket.__yesno_req_id = uuidv4();
    this.clientRequests[socket.__yesno_req_id] = { clientOptions };
  }

  private getRequestId(interceptedRequest: http.IncomingMessage): string {
    const id = interceptedRequest.headers[YESNO_INTERNAL_HTTP_HEADER] as string | undefined;

    if (!id) {
      throw new Error('Missing internal header');
    }

    return id;
  }
}
