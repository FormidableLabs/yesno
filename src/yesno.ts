import { IDebugger } from 'debug';
import * as http from 'http';
import * as _ from 'lodash';
import Mitm = require('mitm');
import { EOL } from 'os';
import * as readable from 'readable-stream';
import uuid = require('uuid');
import { DEFAULT_REDACT_SYMBOL } from './consts';
import Context, { IInFlightRequest } from './context';
import { YesNoError } from './errors';
import { IQueryRecords } from './helpers';
import {
  RequestSerializer,
  SerializedRequest,
  SerializedRequestResponse,
  SerializedResponse,
} from './http-serializer';
import Interceptor, { IInterceptEvent, IProxiedEvent } from './interceptor';
import { assertMatches, load, save } from './mocks';
import QueryableRequestsCollection, { IQueryable, RedactSymbol } from './queryable-collection';
const debug: IDebugger = require('debug')('yesno');
const { version }: { version: string } = require('../package.json');

export enum Mode {
  /**
   * Intercept requests and respond with local mocks
   */
  Mock,
  /**
   * Spy on request/response
   */
  Spy,
}

export interface YesNoOptions {
  /**
   * Test mode
   */
  mode?: Mode;
  /**
   * Default directory to locate and persist intercepted request/response
   */
  dir?: string;
  redactSymbol?: string;
}

// tslint:disable-next-line:max-classes-per-file
export class YesNo implements IQueryable {
  public mode: Mode = Mode.Spy;
  public redactSymbol: string = DEFAULT_REDACT_SYMBOL;
  public dir?: string;
  private interceptor?: Interceptor;
  private readonly ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
  }

  /**
   * Enable intercepting requests
   */
  public enable(options?: YesNoOptions): void {
    if (this.interceptor) {
      throw new YesNoError('Cannot enable if already enabled');
    }

    const { mode = Mode.Spy, redactSymbol = DEFAULT_REDACT_SYMBOL, dir }: YesNoOptions =
      options || {};
    this.mode = mode;
    this.dir = dir;
    this.redactSymbol = redactSymbol;

    debug('Enabling intercept');
    this.interceptor = this.createInterceptor();
  }

  /**
   * Disable intercepting requests
   */
  public disable(): void {
    if (!this.interceptor) {
      throw new YesNoError('Cannot disable if not enabled');
    }

    this.clear();
    this.interceptor.disable();
    this.interceptor = undefined;
  }

  /**
   * Mock responses for intecepted requests
   * @param name Unique name for mocks
   */
  public async mock(name: string, dir?: string): Promise<SerializedRequestResponse[]> {
    this.setMode(Mode.Mock);
    this.ctx.loadedMocks = await this.load(name, dir);

    return this.ctx.loadedMocks;
  }

  /**
   * Spy on intercepted requests
   */
  public spy() {
    this.setMode(Mode.Spy);
  }

  /**
   * Save intercepted requests _if_ we're in Spy mode.
   *
   * @param name Filename
   * @param dir Optionally provide directory for file
   * @returns Full filename of saved JSON if generated
   */
  public save(name: string, dir?: string): Promise<string | void> {
    dir = dir || this.dir;
    if (dir === undefined) {
      return Promise.reject(
        new YesNoError('Cannot save intercepted requests without configured dir'),
      );
    }

    if (this.isMode(Mode.Mock)) {
      debug('No need to save in mock mode');
      return Promise.resolve();
    }

    const interceptedRequests = this.ctx.interceptedRequestsCompleted;
    const inFlightRequests = this.ctx.inFlightRequests.filter((x) => x) as IInFlightRequest[];

    if (inFlightRequests.length) {
      const urls = inFlightRequests
        .map(
          ({ requestSerializer }) =>
            `${requestSerializer.method}${this.formatUrl(requestSerializer)}`,
        )
        .join(EOL);
      throw new YesNoError(
        `Cannot save. Still have ${inFlightRequests.length} in flight requests: ${EOL}${urls}`,
      );
    }

    debug('Saving %s...', name);

    return save(name, dir, this.ctx.interceptedRequestsCompleted);
  }

  /**
   * Clear all stateful information about requests.
   *
   * If used in a test suite, this should be called after each test.
   */
  public clear() {
    this.ctx.clear();
    (this.interceptor as Interceptor).requestNumber = 0;
  }

  /**
   * Get all intercepted request/response which match the provided query
   *
   * Match against the URL if query is a string or regexp.
   * Otherwise perform a partial match against each serialized request response
   * @param query
   */
  public matching(query: string | RegExp | IQueryRecords): QueryableRequestsCollection {
    const normalizedQuery: IQueryRecords =
      _.isString(query) || _.isRegExp(query) ? { url: query } : query;

    return this.getCollection(normalizedQuery);
  }

  /**
   * Get all intercepted requests
   */
  public intercepted(): SerializedRequestResponse[] {
    return this.getCollection().intercepted();
  }

  /**
   * Get all loaded mocks
   */
  public mocks(): SerializedRequestResponse[] {
    return this.getCollection().mocks();
  }

  /**
   * Redact property on all records
   */
  public redact(property: string | string[], redactSymbol?: RedactSymbol): void {
    return this.getCollection().redact(property, redactSymbol);
  }

  /**
   * Determine the current mode
   */
  private isMode(mode: Mode): boolean {
    return this.mode === mode;
  }

  private createInterceptor() {
    const interceptor = new Interceptor({ mitm: Mitm(), shouldProxy: !this.isMode(Mode.Mock) });
    interceptor.on(
      'intercept',
      ({
        requestSerializer,
        interceptedRequest,
        interceptedResponse,
        requestNumber,
      }: IInterceptEvent) => {
        this.ctx.inFlightRequests[requestNumber] = {
          requestSerializer,
          startTime: Date.now(),
        };

        if (!this.isMode(Mode.Mock)) {
          return;
        }

        this.mockResponse({
          interceptedRequest,
          interceptedResponse,
          requestNumber,
          requestSerializer,
        });
      },
    );

    interceptor.on(
      'proxied',
      ({ requestSerializer, responseSerializer, requestNumber }: IProxiedEvent) => {
        this.recordCompleted(
          requestSerializer.serialize(),
          responseSerializer.serialize(),
          requestNumber,
        );
      },
    );

    return interceptor;
  }

  private setMode(mode: Mode) {
    this.mode = mode;

    if (this.interceptor) {
      this.interceptor.proxy(!this.isMode(Mode.Mock));
    }
  }

  /**
   * Load request/response mocks from disk
   * @param name Mock name
   * @param dir Override default directory
   */
  private load(name: string, dir?: string): Promise<SerializedRequestResponse[]> {
    dir = dir || this.dir;
    if (dir === undefined) {
      return Promise.reject(new YesNoError('Cannot load mock without configured dir'));
    }

    return load(name, dir);
  }

  private getCollection(query?: IQueryRecords): QueryableRequestsCollection {
    return new QueryableRequestsCollection({
      context: this.ctx,
      defaultRedactSymbol: this.redactSymbol,
      query,
    });
  }

  private async mockResponse({
    interceptedRequest,
    interceptedResponse,
    requestSerializer,
    requestNumber,
  }: {
    interceptedRequest: http.IncomingMessage;
    interceptedResponse: http.ServerResponse;
    requestSerializer: RequestSerializer;
    requestNumber: number;
  }): Promise<void> {
    debug('Mock response');

    await (readable as any).pipeline(interceptedRequest, requestSerializer);
    const serializedRequest = requestSerializer.serialize();
    const mock = this.ctx.loadedMocks[requestNumber];

    if (!mock) {
      throw new YesNoError(`No mock found for request #${requestNumber}`);
    }

    assertMatches(serializedRequest, mock.request, requestNumber);

    // interceptedResponse.statusCode = mock.response.statusCode;
    // for (const entry of Object.entries(mock.response.headers)) {
    //   const [header, value] = entry;
    //   interceptedResponse.setHeader(header, value as string | string[] | number);
    // }

    interceptedResponse.writeHead(mock.response.statusCode, mock.response.headers);
    interceptedResponse.write(mock.response.body);
    interceptedResponse.end();

    this.recordCompleted(serializedRequest, mock.response, requestNumber);
  }

  private recordCompleted(
    request: SerializedRequest,
    response: SerializedResponse,
    requestNumber: number,
  ): void {
    const now = Date.now();
    const url = this.formatUrl(request);
    const duration = now - (this.ctx.inFlightRequests[requestNumber] as IInFlightRequest).startTime;

    this.ctx.interceptedRequestsCompleted[requestNumber] = {
      __duration: duration,
      __id: uuid.v4(),
      __timestamp: now,
      __version: version,
      request,
      response,
      url,
    };
    this.ctx.inFlightRequests[requestNumber] = null;

    debug('Added request-response for %s %s (duration: %d)', request.method, url, duration);
  }

  private formatUrl(request: SerializedRequest) {
    return `${request.protocol}://${request.host}:${request.port}${request.path}`;
  }
}
