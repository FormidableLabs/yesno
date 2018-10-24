import { IDebugger } from 'debug';
import * as _ from 'lodash';
import { EOL } from 'os';
import * as readable from 'readable-stream';
import { DEFAULT_REDACT_SYMBOL } from './consts';
import Context, { IInFlightRequest } from './context';
import { YesNoError } from './errors';
import { IQueryRecords } from './helpers';
import {
  createRecord,
  formatUrl,
  SerializedRequest,
  SerializedRequestResponse,
  SerializedResponse,
} from './http-serializer';
import Interceptor, { IInterceptEvent, IProxiedEvent } from './interceptor';
import * as mocking from './mocking';
import { IHttpMock } from './mocking';
import QueryableRequestsCollection, { IQueryable, RedactSymbol } from './queryable-collection';
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

export interface YesNoOptions {
  /**
   * Default directory to locate and persist intercepted request/response
   */
  dir?: string;
  redactSymbol?: string;
}

// tslint:disable-next-line:max-classes-per-file
export class YesNo implements IQueryable {
  public redactSymbol: string = DEFAULT_REDACT_SYMBOL;
  public dir?: string;
  private mode: Mode = Mode.Spy;
  private interceptor: Interceptor;
  private readonly ctx: Context;

  constructor(ctx: Context) {
    this.ctx = ctx;
    this.interceptor = this.createInterceptor();
  }

  /**
   * Enable intercepting requests
   */
  public enable(options?: YesNoOptions): YesNo {
    const { redactSymbol = DEFAULT_REDACT_SYMBOL, dir }: YesNoOptions = options || {};
    this.dir = dir;
    this.redactSymbol = redactSymbol;

    debug('Enabling intercept');
    this.interceptor.enable();

    return this;
  }

  /**
   * Disable intercepting requests
   */
  public disable(): void {
    debug('Disabling intercept');
    this.clear();
    this.interceptor.disable();
  }

  /**
   * Spy on intercepted requests
   */
  public spy(): YesNo {
    this.setMode(Mode.Spy);
    return this;
  }

  /**
   * Mock responses for intecepted requests
   * @param name Unique name for mocks
   */
  public mock(mocks?: IHttpMock[]): YesNo {
    this.setMode(Mode.Mock);

    if (mocks) {
      this.setMocks(mocks.map(mocking.hydrateHttpMock));
    }

    return this;
  }

  /**
   * Load request/response mocks from disk
   * @param name Mock name
   * @param dir Override default directory
   */
  public async load(name: string, dir?: string): Promise<SerializedRequestResponse[]> {
    debug('Loading mocks');
    dir = dir || this.dir;
    if (dir === undefined) {
      return Promise.reject(new YesNoError('Cannot load mock without configured dir'));
    }

    this.setMocks(await mocking.load(name, dir));

    return this.ctx.loadedMocks;
  }

  /**
   * Save intercepted requests _if_ we're in Spy mode.
   *
   * @todo Use the same name/dir as the loaded mocks IF available...?
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

    debug('Saving %s...', name);

    return mocking.save(name, dir, this.ctx.interceptedRequestsCompleted);
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

  private setMocks(mocks: SerializedRequestResponse[]): void {
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

  private getCollection(query?: IQueryRecords): QueryableRequestsCollection {
    return new QueryableRequestsCollection({
      context: this.ctx,
      defaultRedactSymbol: this.redactSymbol,
      query,
    });
  }

  private isEnabled(): boolean {
    return !!this.interceptor;
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
      mocking.assertMatches(serializedRequest, mock.request, requestNumber);

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
    request: SerializedRequest,
    response: SerializedResponse,
    requestNumber: number,
  ): void {
    const duration =
      Date.now() - (this.ctx.inFlightRequests[requestNumber] as IInFlightRequest).startTime;
    const record = createRecord({ request, response, duration });
    this.ctx.interceptedRequestsCompleted[requestNumber] = record;
    this.ctx.inFlightRequests[requestNumber] = null;

    debug('Added request-response for %s %s (duration: %d)', request.method, record.url, duration);
  }
}
