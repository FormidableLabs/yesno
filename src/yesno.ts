import { IDebugger } from 'debug';
import * as _ from 'lodash';
import { EOL } from 'os';
import * as readable from 'readable-stream';
import { YESNO_RECORDING_MODE_ENV_VAR } from './consts';
import Context, { IInFlightRequest } from './context';
import { YesNoError } from './errors';
import * as file from './file';
import FilteredHttpCollection, { IFiltered } from './filtering/collection';
import * as comparator from './filtering/comparator';
import { ISerializedHttpPartialDeepMatch, MatchFn } from './filtering/matcher';
import { Redactor } from './filtering/redact';
import {
  createRecord,
  formatUrl,
  ISerializedHttp,
  ISerializedRequest,
  ISerializedResponse,
  validateSerializedHttpArray,
} from './http-serializer';
import Interceptor, { IInterceptEvent, IInterceptOptions, IProxiedEvent } from './interceptor';
import Recording, { RecordMode as Mode } from './recording';
const debug: IDebugger = require('debug')('yesno');

export type GenericTest = (...args: any) => Promise<any> | void;
export type GenericTestFunction = (title: string, fn: GenericTest) => any;

export interface IRecordableTest {
  test?: GenericTestFunction;
  it?: GenericTestFunction;
  prefix?: string;
  dir: string;
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
   * @returns Full filename of saved JSON if generated
   */
  public async save(options: file.ISaveOptions & file.IFileOptions): Promise<string | void> {
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
   * Create a filter collection
   * @todo Convert everything to a match fn
   * @param query
   */
  public matching(
    filter?: string | RegExp | ISerializedHttpPartialDeepMatch | MatchFn,
  ): FilteredHttpCollection {
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
    return this.getCollection().redact(property, redactor);
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
    const { ignorePorts = [] }: IInterceptOptions = options || {};

    debug('Enabling intercept. Ignoring ports', ignorePorts);
    this.interceptor.enable({ ignorePorts });

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

  private getCollection(
    matcher?: ISerializedHttpPartialDeepMatch | MatchFn,
  ): FilteredHttpCollection {
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

      const bodyString = _.isPlainObject(mock.response.body)
        ? JSON.stringify(mock.response.body)
        : mock.response.body;
      interceptedResponse.writeHead(mock.response.statusCode, mock.response.headers);
      interceptedResponse.write(bodyString);
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
