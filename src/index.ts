import { expect } from 'chai';
import { IDebugger } from 'debug';
import { readFile, writeFile } from 'fs';
import * as http from 'http';
import { ClientRequest } from 'http';
import * as https from 'https';
import * as _ from 'lodash';
import Mitm = require('mitm');
import * as path from 'path';
import * as readable from 'readable-stream';
import { pipeline } from 'stream';
import { YESNO_INTERNAL_HTTP_HEADER } from './consts';
import {
  ClientRequestFull,
  RequestSerializer,
  ResponseSerializer,
  SerializedRequest,
  SerializedRequestResponse,
} from './http-serializer';
const debug: IDebugger = require('debug')('yesno');

interface ProxyRequestOptions extends http.RequestOptions {
  proxying?: boolean;
}

export enum Mode {
  /**
   * Intercept requests and respond with local mocks
   */
  Mock,
  /**
   * Spy on request/response then generate mocks
   */
  Record,
  /**
   * Spy on request/response
   */
  Spy,
  /**
   * Do nothing. HTTP & TCP will be completely unmodified.
   *
   * Note that all assertions will throw exceptions if YesNo is off.
   */
  Off,
}
export interface YesNoOptions {
  /**
   * Test mode
   */
  mode?: Mode;
  /**
   * Default directory to locate and persist intercepted request/response
   */
  dir: string;
}

interface RegisteredSocket extends Mitm.BypassableSocket {
  __yesno_req_id?: string;
}

interface ClientRequestTracker {
  [key: string]: {
    clientOptions: http.RequestOptions;
    clientRequest?: ClientRequestFull;
  };
}

let clientRequestId: number = 0;
const clientRequests: ClientRequestTracker = {};

function setOptions(socket: RegisteredSocket, clientOptions: ProxyRequestOptions): void {
  socket.__yesno_req_id = String(clientRequestId);
  clientRequests[clientRequestId] = { clientOptions };

  clientRequestId++;
}

export class YesNo {
  public interceptedRequests: SerializedRequestResponse[] = [];
  private mocks: SerializedRequestResponse[] = [];
  private mitm: undefined | Mitm.Mitm;
  private mode: Mode;
  private dir: string;

  constructor({ mode = Mode.Spy, dir }: YesNoOptions) {
    this.mode = mode;
    this.dir = dir;
  }

  public enable(): void {
    debug('Enabling intercept');

    // @todo Disable this later
    ClientRequest.prototype.onSocket = _.flowRight(
      ClientRequest.prototype.onSocket,
      // tslint:disable-next-line:only-arrow-functions
      function(this: ClientRequestFull, socket: RegisteredSocket): RegisteredSocket {
        debug('ClientRequest:onSocket');
        if (undefined !== socket.__yesno_req_id) {
          // Give precedence to the parsed path
          clientRequests[socket.__yesno_req_id].clientRequest = this;
          this.setHeader(YESNO_INTERNAL_HTTP_HEADER, socket.__yesno_req_id);
        }

        return socket;
      },
    );

    this.mitm = Mitm();

    this.mitm.on('connect', this._mitmOnConnect.bind(this) as Mitm.SocketConnectCallback);
    this.mitm.on('request', this._mitmOnRequest.bind(this));
  }

  public load(name: string): Promise<SerializedRequestResponse[] | void> {
    if (!this.isMode(Mode.Mock)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const filename = path.join(this.dir, `${name}-yesno.json`);
      debug('Loading requests from', filename);

      readFile(filename, (e: Error, data: Buffer) => {
        if (e) {
          return reject(e);
        }

        this.mocks = JSON.parse(data.toString());
        resolve(this.mocks);
      });
    });
  }

  /**
   * Save intercepted request/response if we're in record mode.
   * Clears local copy of intercepted request.
   * @returns Full filename of saved JSON if generated
   */
  public save(name: string): Promise<string | void> {
    const interceptedRequests = this.interceptedRequests;
    this.interceptedRequests = [];

    if (!this.isMode(Mode.Record)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const contents = JSON.stringify(interceptedRequests);
      const filename = path.join(this.dir, `${name}-yesno.json`);
      debug('Saving %d requests to %s', this.interceptedRequests.length, filename);

      writeFile(filename, contents, (e: Error) => (e ? reject(e) : resolve(filename)));
    });
  }

  public isMode(mode: Mode): boolean {
    return this.mode === mode;
  }

  private _mitmOnConnect(socket: Mitm.BypassableSocket, options: ProxyRequestOptions): void {
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
    debug('mitm event:request');

    const id = this._getRequestId(interceptedRequest);

    function debugReq(formatter: string, ...args: any[]): void {
      debug(`[id:${id}] ${formatter}`, ...args);
    }

    if (!clientRequests[id]) {
      debugReq(`Error: Missing client options for yesno req ${id}`);
      throw new Error(`Missing client options for yesno req ${id}`);
    }

    const { clientOptions } = clientRequests[id];
    const clientRequest: ClientRequestFull = clientRequests[id].clientRequest as ClientRequestFull;
    const isHttps: boolean = (interceptedRequest.connection as any).encrypted;
    const requestSerializer = new RequestSerializer(
      clientOptions,
      clientRequest,
      interceptedRequest,
      isHttps,
    );

    if (this.isMode(Mode.Mock)) {
      this._mockResponse(interceptedRequest, interceptedResponse, requestSerializer);
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
        debugReq('Response complete');
        this.interceptedRequests.push({
          request: requestSerializer.serialize(),
          response: responseSerializer.serialize(),
        });
      });
    });
  }

  private async _mockResponse(
    interceptedRequest: http.IncomingMessage,
    interceptedResponse: http.ServerResponse,
    requestSerializer: RequestSerializer,
  ): Promise<void> {
    debug('Mock response');

    await (readable as any).pipeline(interceptedRequest, requestSerializer);
    const serializedRequest = requestSerializer.serialize();
    const i: number = this.interceptedRequests.length;
    const mock = this.mocks[i];

    this.assertMatches(serializedRequest, mock.request, i + 1);

    interceptedResponse.statusCode = mock.response.statusCode;
    for (const entry of Object.entries(mock.response.headers)) {
      const [header, value] = entry;
      interceptedResponse.setHeader(header, value as string | string[] | number);
    }

    if (mock.response.body) {
      interceptedResponse.write(mock.response.body);
    }

    this.interceptedRequests.push({
      request: serializedRequest,
      response: mock.response,
    });
  }

  private assertMatches(
    currentRequest: SerializedRequest,
    mockRequest: SerializedRequest,
    requestNum: number,
  ): void {
    expect(currentRequest.host, `YesNo: Expected different host for request #${requestNum}`).to.eql(
      mockRequest.host,
    );
    const { host } = currentRequest;

    expect(
      currentRequest.protocol,
      `YesNo: Expected request #${requestNum} to ${host} to use the ${mockRequest.method} method`,
    ).to.eql(mockRequest.protocol);

    expect(
      currentRequest.protocol,
      `YesNo: Expected request #${requestNum} to ${host} to be served over ${mockRequest.protocol}`,
    ).to.eql(mockRequest.protocol);

    expect(
      currentRequest.port,
      `YesNo: Expected request #${requestNum} to ${host} to be served on port ${mockRequest.port}`,
    ).to.eql(mockRequest.port);

    const nickname = `${currentRequest.method} ${currentRequest.protocol}://${
      currentRequest.host
    }:${currentRequest.port}`;

    // @todo check auth part

    expect(
      currentRequest.path,
      `YesNo: Expected request #${requestNum} "${nickname}" to have path ${mockRequest.path}`,
    ).to.eql(mockRequest.path);

    // @todo check query and hash
    // @todo check headers

    expect(
      currentRequest.body,
      `YesNo: Request #${requestNum} "${nickname}${mockRequest.path}" has unexpected body`,
    ).to.eql(mockRequest.body);
  }

  private _getRequestId(interceptedRequest: http.IncomingMessage): string {
    const id: string = interceptedRequest.headers[YESNO_INTERNAL_HTTP_HEADER] as string;

    if (!id) {
      throw new Error('Missing internal header');
    }

    return id;
  }
}
