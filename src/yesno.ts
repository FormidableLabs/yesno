import { IDebugger } from 'debug';
import * as _ from 'lodash';
import { EOL } from 'os';

import { YESNO_RECORDING_MODE_ENV_VAR } from './consts';
import Context, { IInFlightRequest } from './context';
import { YesNoError } from './errors';
import * as file from './file';
import FilteredHttpCollection, { IFiltered } from './filtering/collection';
import { ComparatorFn } from './filtering/comparator';
import { ISerializedHttpPartialDeepMatch, MatchFn } from './filtering/matcher';
import { redact as redactRecord, Redactor } from './filtering/redact';
import {
  createRecord,
  formatUrl,
  ISerializedHttp,
  ISerializedRequest,
  ISerializedResponse,
  RequestSerializer,
  validateSerializedHttpArray,
} from './http-serializer';
import Interceptor, { IInterceptEvent, IInterceptOptions, IProxiedEvent } from './interceptor';
import MockResponse from './mock-response';
import Recording, { RecordMode as Mode } from './recording';

const debug: IDebugger = require('debug')('yesno');

export type GenericTest = (...args: any) => Promise<any> | void;
export type GenericTestFunction = (title: string, fn: GenericTest) => any;

export type HttpFilter = string | RegExp | ISerializedHttpPartialDeepMatch | MatchFn;

export interface IRecordableTest {
  test?: GenericTestFunction;
  it?: GenericTestFunction;
  prefix?: string;
  dir: string;
}

/**
 * Options to configure intercept of HTTP requests
 */
export interface IYesNoInterceptingOptions extends IInterceptOptions {
  /**
   * Comparator function used to determine whether an intercepted request
   * matches a loaded mock.
   */
  comparatorFn?: ComparatorFn;
}

/**
 * Client API for YesNo
 */
export class YesNo implements IFiltered {
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
  public spy(options?: IYesNoInterceptingOptions): void {
    this.enable(options);
    this.setMode(Mode.Spy);
  }

  /**
   * Mock responses for intercepted requests
   * @todo Reset the request counter?
   */
  public mock(mocks: file.IHttpMock[], options?: IYesNoInterceptingOptions): void {
    this.enable(options);
    this.setMode(Mode.Mock);

    this.setMocks(mocks.map(file.hydrateHttpMock));
  }

  /**
   * Start a new recording.
   *
   * Depending on the configured mode, will either spy on all outbound HTTP requests
   * or return mocks loaded from disc.
   *
   * When done, call the `complete()` on the returned recording
   * to save all intercepted requests to disc if applicable.
   * @param options Where to load/save mocks
   * @returns A new recording.
   */
  public async recording(options: file.IFileOptions): Promise<Recording> {
    const mode = this.getModeByEnv();

    if (mode !== Mode.Mock) {
      this.spy();
    } else {
      this.mock(await this.load(options));
    }

    return new Recording({
      ...options,
      getRecordsToSave: this.getRecordsToSave.bind(this),
      mode,
    });
  }

  /**
   * Create a test function that will wrap its provided test in a recording.
   */
  public test({ it, test, dir, prefix }: IRecordableTest): GenericTestFunction {
    const runTest = test || it;

    if (!runTest) {
      throw new YesNoError('Missing "test" or "it" test function');
    }

    return (title: string, fn: GenericTest): GenericTestFunction => {
      const filename = file.getMockFilename(prefix ? `${prefix}-${title}` : title, dir);

      return runTest(title, async () => {
        debug('Running test "%s"', title);
        this.restore();

        try {
          const recording = await this.recording({ filename });
          await fn();
          debug('Saving test "%s"', filename);
          await recording.complete();
        } finally {
          this.restore();
        }
      });
    };
  }

  /**
   * Load request/response mocks from disk
   */
  public async load(options: file.IFileOptions): Promise<ISerializedHttp[]> {
    debug('Loading mocks');
    const records = await file.load(options as file.IFileOptions);

    validateSerializedHttpArray(records);

    return records;
  }
  /**
   * Save intercepted requests
   *
   * Normally save is called by the complete method and will only succeed if there are
   * no in-flight requests (i.e. all open requests have completed). However, if for some
   * reason a request will not complete and you need to save the successful requests up to
   * that point, you can set 'force' option to true and call this save method.
   *
   * @returns Full filename of saved JSON if generated
   */
  public async save(options: file.ISaveOptions & file.IFileOptions): Promise<string | void> {
    options.records = options.records || this.getRecordsToSave(options.force);

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
   * Create a filter collection
   * @todo Convert everything to a match fn
   * @param query
   */
  public matching(filter?: HttpFilter): FilteredHttpCollection {
    const normalizedFilter: ISerializedHttpPartialDeepMatch | MatchFn | undefined =
      _.isString(filter) || _.isRegExp(filter) ? { url: filter } : filter;

    return this.getCollection(normalizedFilter);
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
    if (this.getCollection().intercepted().length) {
      return this.getCollection().redact(property, redactor);
    }
    this.ctx.autoRedact = { property, redactor };
  }

  private getModeByEnv(): Mode {
    const env = (process.env[YESNO_RECORDING_MODE_ENV_VAR] || Mode.Mock).toLowerCase();

    if (!Object.values(Mode).includes(env)) {
      throw new YesNoError(
        // tslint:disable-next-line:max-line-length
        `Invalid mode "${env}" set for ${YESNO_RECORDING_MODE_ENV_VAR}. Must be one of ${Object.values(
          Mode,
        ).join(', ')}`,
      );
    }

    return env as Mode;
  }

  private getRecordsToSave(force: boolean = false): ISerializedHttp[] {
    const inFlightRequests = this.ctx.inFlightRequests.filter((x) => x) as IInFlightRequest[];

    if (inFlightRequests.length && !force) {
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
  private enable(options?: IYesNoInterceptingOptions): YesNo {
    const { comparatorFn, ignorePorts = [] }: IYesNoInterceptingOptions = options || {};

    debug('Enabling intercept. Ignoring ports', ignorePorts);
    this.interceptor.enable({ ignorePorts });
    this.ctx.comparatorFn = comparatorFn || this.ctx.comparatorFn;

    return this;
  }

  private setMocks(mocks: ISerializedHttp[]): void {
    validateSerializedHttpArray(mocks);
    this.ctx.loadedMocks = mocks;
  }

  /**
   * Determine the current mode
   */
  private isMode(mode: Mode): boolean {
    return this.ctx.mode === mode;
  }

  private createInterceptor() {
    const interceptor = new Interceptor();

    interceptor.on('intercept', this.onIntercept.bind(this));
    interceptor.on('proxied', this.onProxied.bind(this));

    return interceptor;
  }

  private async onIntercept(event: IInterceptEvent): Promise<void> {
    this.recordRequest(event.requestSerializer, event.requestNumber);

    if (!this.ctx.hasResponsesDefinedForMatchers() && !this.isMode(Mode.Mock)) {
      // No need to mock, send event to its original destination
      return event.proxy();
    }

    // proxy requst if ignore is set
    if (this.ctx.hasMatchingIgnore(event.requestSerializer)) {
      return event.proxy();
    }

    try {
      const mockResponse = new MockResponse(event, this.ctx);
      const sent = await mockResponse.send();

      if (sent) {
        // redact properties if needed
        if (this.ctx.autoRedact !== null) {
          const properties = _.isArray(this.ctx.autoRedact.property)
            ? this.ctx.autoRedact.property
            : [this.ctx.autoRedact.property];
          const record = createRecord({
            duration: 0,
            request: sent.request,
            response: sent.response,
          });
          sent.request = redactRecord(record, properties, this.ctx.autoRedact.redactor).request;
        }

        this.recordResponse(sent.request, sent.response, event.requestNumber);
      } else if (this.isMode(Mode.Mock)) {
        throw new Error('Unexpectedly failed to send mock respond');
      }
    } catch (e) {
      if (!(e instanceof YesNoError)) {
        debug(`[#${event.requestNumber}] Mock response failed unexpectedly`, e);
        e.message = `YesNo: Mock response failed: ${e.message}`;
      } else {
        debug(`[#${event.requestNumber}] Mock response failed`, e.message);
      }

      event.clientRequest.emit('error', e);
    }
  }

  private onProxied({ requestSerializer, responseSerializer, requestNumber }: IProxiedEvent): void {
    this.recordResponse(
      requestSerializer.serialize(),
      responseSerializer.serialize(),
      requestNumber,
    );
  }

  private setMode(mode: Mode) {
    this.ctx.mode = mode;
  }

  private getCollection(
    matcher?: ISerializedHttpPartialDeepMatch | MatchFn,
  ): FilteredHttpCollection {
    return new FilteredHttpCollection({
      context: this.ctx,
      matcher,
    });
  }

  private recordRequest(requestSerializer: RequestSerializer, requestNumber: number): void {
    this.ctx.inFlightRequests[requestNumber] = {
      requestSerializer,
      startTime: Date.now(),
    };
  }

  private recordResponse(
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
