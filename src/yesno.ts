import { IDebugger } from 'debug';
import * as _ from 'lodash';
import { EOL } from 'os';
import * as readable from 'readable-stream';
import { DEFAULT_PORT_HTTP, DEFAULT_PORT_HTTPS } from './consts';
import Context, { IInFlightRequest } from './context';
import { YesNoError } from './errors';
import * as file from './file';
import FilteredHttpCollection, { IFiltered } from './filtering/collection';
import * as comparator from './filtering/comparator';
import { ISerializedHttpPartialDeepMatch } from './filtering/matcher';
import { Redactor } from './filtering/redact';
import {
  createRecord,
  formatUrl,
  ISerializedHttp,
  ISerializedRequest,
  ISerializedResponse,
  validateSerializedHttpArray,
} from './http-serializer';
import Interceptor, { IInterceptEvent, IProxiedEvent } from './interceptor';
const debug: IDebugger = require('debug')('yesno');

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

export interface IInterceptOptions {
  ports?: number[];
}

export class YesNo implements IFiltered {
  private mode: Mode = Mode.Spy;
  private readonly interceptor: Interceptor;
  private readonly ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.interceptor = this.createInterceptor();
  }

  /**
   * Restore HTTP functionality
   */
  public restore(): void {
    debug('Disabling intercept');
    this.clear();
    this.interceptor.disable();
  }

  /**
   * Spy on intercepted requests
   */
  public spy(options?: IInterceptOptions): void {
    this.enable(options);
    this.setMode(Mode.Spy);
  }

  /**
   * Mock responses for intecepted requests
   * @todo Reset the request counter?
   */
  public mock(mocks: file.IHttpMock[], options?: IInterceptOptions): void {
    this.enable(options);
    this.setMode(Mode.Mock);

    this.setMocks(mocks.map(file.hydrateHttpMock));
  }

  /**
   * Load request/response mocks from disk
   * @param name Mock name
   * @param dir Override default directory
   */
  public async load(options: file.IFileOptions): Promise<ISerializedHttp[]>;
  public async load(name: string, dir: string): Promise<ISerializedHttp[]>;
  public async load(
    nameOrOptions: string | file.IFileOptions,
    dir?: string,
  ): Promise<ISerializedHttp[]> {
    debug('Loading mocks');
    let options = nameOrOptions;

    if (!_.isPlainObject(nameOrOptions)) {
      if (!dir) {
        throw new YesNoError('Must provide directory with mock name');
      }

      options = {
        filename: file.getMockFilename(nameOrOptions as string, dir),
      };
    }

    const records = await file.load(options as file.IFileOptions);

    validateSerializedHttpArray(records);

    return records;
  }
  /**
   * Save intercepted requests _if_ we're in Spy mode.
   *
   * @todo Use the same name/dir as the loaded mocks IF available...?
   * @param name Filename
   * @param dir Optionally provide directory for file
   * @returns Full filename of saved JSON if generated
   */
  public async save(options: file.ISaveOptions & file.IFileOptions): Promise<string | void>;
  public async save(name: string, dir: string): Promise<string | void>;
  public save(
    nameOrOptions: string | (file.ISaveOptions & file.IFileOptions),
    dir?: string,
  ): Promise<string | void> {
    let options: file.IFileOptions & file.ISaveOptions;

    if (!_.isPlainObject(nameOrOptions)) {
      if (!dir) {
        throw new YesNoError('Must provide directory with mock name');
      }

      options = {
        filename: file.getMockFilename(nameOrOptions as string, dir),
      };
    } else {
      options = nameOrOptions as file.ISaveOptions & file.IFileOptions;
    }

    if (!options.records && this.isMode(Mode.Mock)) {
      debug('Nothing to save. No records or running in mock mode.');
      return Promise.resolve();
    }

    options.records = options.records || this.getRecordsToSave();

    return file.save(options);
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
  public matching(
    query: string | RegExp | ISerializedHttpPartialDeepMatch,
  ): FilteredHttpCollection {
    const normalizedQuery: ISerializedHttpPartialDeepMatch =
      _.isString(query) || _.isRegExp(query) ? { url: query } : query;

    return this.getCollection(normalizedQuery);
  }

  /**
   * Get all intercepted requests
   */
  public intercepted(): ISerializedHttp[] {
    return this.getCollection().intercepted();
  }

  /**
   * Get all loaded mocks
   */
  public mocks(): ISerializedHttp[] {
    return this.getCollection().mocks();
  }

  /**
   * Redact property on all records
   */
  public redact(property: string | string[], redactor?: Redactor): void {
    return this.getCollection().redact(property, redactor);
  }

  private getRecordsToSave(): ISerializedHttp[] {
    const inFlightRequests = this.ctx.inFlightRequests.filter((x) => x) as IInFlightRequest[];

    if (inFlightRequests.length) {
      const urls = inFlightRequests
        .map(
          ({ requestSerializer }) => `${requestSerializer.method}${formatUrl(requestSerializer)}`,
        )
        .join(EOL);
      throw new YesNoError(
        `Cannot save. Still have ${inFlightRequests.length} in flight requests: ${EOL}${urls}`,
      );
    }

    return this.ctx.interceptedRequestsCompleted;
  }

  /**
   * Enable intercepting requests
   */
  private enable(options?: IInterceptOptions): YesNo {
    const { ports = [] }: IInterceptOptions = options || {};
    const portsWithDefaults = [DEFAULT_PORT_HTTP, DEFAULT_PORT_HTTPS, ...ports];

    debug('Enabling intercept on ports', ports);
    this.interceptor.enable(portsWithDefaults);

    return this;
  }

  private setMocks(mocks: ISerializedHttp[]): void {
    this.ctx.loadedMocks = mocks;
  }

  /**
   * Determine the current mode
   */
  private isMode(mode: Mode): boolean {
    return this.mode === mode;
  }

  private createInterceptor() {
    const interceptor = new Interceptor({ shouldProxy: !this.isMode(Mode.Mock) });
    interceptor.on('intercept', (event: IInterceptEvent) => {
      this.ctx.inFlightRequests[event.requestNumber] = {
        requestSerializer: event.requestSerializer,
        startTime: Date.now(),
      };

      if (this.isMode(Mode.Mock)) {
        this.mockResponse(event);
      }
    });

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

  private getCollection(matcher?: ISerializedHttpPartialDeepMatch): FilteredHttpCollection {
    return new FilteredHttpCollection({
      context: this.ctx,
      matcher,
    });
  }

  private async mockResponse({
    clientRequest,
    interceptedRequest,
    interceptedResponse,
    requestSerializer,
    requestNumber,
  }: IInterceptEvent): Promise<void> {
    debug('Mock response');
    try {
      await (readable as any).pipeline(interceptedRequest, requestSerializer);

      const serializedRequest = requestSerializer.serialize();
      const mock = this.ctx.loadedMocks[requestNumber];

      if (!mock) {
        throw new YesNoError(`No mock found for request #${requestNumber}`);
      }

      // Assertion must happen before promise -
      // mitm does not support promise rejections on "request" event
      comparator.byUrl(serializedRequest, mock.request, { requestIndex: requestNumber });

      interceptedResponse.writeHead(mock.response.statusCode, mock.response.headers);
      interceptedResponse.write(mock.response.body);
      interceptedResponse.end();

      this.recordCompleted(serializedRequest, mock.response, requestNumber);
    } catch (e) {
      if (!(e instanceof YesNoError)) {
        debug('Mock response failed unexpectedly', e);
        e.message = `YesNo: Mock response failed: ${e.message}`;
      } else {
        debug('Mock response failed', e.message);
      }

      clientRequest.emit('error', e);
    }
  }

  private recordCompleted(
    request: ISerializedRequest,
    response: ISerializedResponse,
    requestNumber: number,
  ): void {
    const duration =
      Date.now() - (this.ctx.inFlightRequests[requestNumber] as IInFlightRequest).startTime;
    const record = createRecord({ request, response, duration });
    this.ctx.interceptedRequestsCompleted[requestNumber] = record;
    this.ctx.inFlightRequests[requestNumber] = null;

    debug(
      'Added request-response for %s %s (duration: %d)',
      request.method,
      record.request.host,
      duration,
    );
  }
}
