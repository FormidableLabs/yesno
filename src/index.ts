import { expect } from 'chai';
import { IDebugger } from 'debug';
import { readFile, writeFile } from 'fs';
import * as http from 'http';
import * as _ from 'lodash';
import Mitm = require('mitm');
import { EOL } from 'os';
import * as path from 'path';
import * as readable from 'readable-stream';
import { DEFAULT_REDACT_SYMBOL } from './consts';
import {
  RequestSerializer,
  SerializedRequest,
  SerializedRequestResponse,
  SerializedResponse,
} from './http-serializer';
import Interceptor, { IInterceptEvent, IProxiedEvent } from './interceptor';
const debug: IDebugger = require('debug')('yesno');
const { version }: { version: string } = require('../package.json');

class YesNoError extends Error {
  constructor(message: string) {
    super(`YesNo: ${message}`);
  }
}

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

interface IInFlightRequest {
  startTime: number;
  requestSerializer: RequestSerializer;
}

export interface ISaveFile {
  records: SerializedRequestResponse[];
}

export interface IQueryIntercepted {
  url?: string | RegExp;
  request?: { [P in keyof SerializedRequest]?: SerializedRequest[P] | RegExp };
  response?: { [P in keyof SerializedResponse]?: SerializedResponse[P] | RegExp };
}

// tslint:disable-next-line:max-classes-per-file
export class YesNo {
  /**
   * Completed serialized request-response objects. Used for:
   * A. Assertions
   * B. Saved to disk if in record mode
   */
  public completedRequests: SerializedRequestResponse[] = [];

  public mode: Mode;
  public dir?: string;

  /**
   * Proxied requests which have not yet responded. When completed
   * the value is set to "null" but the index is preserved.
   */
  private inFlightRequests: Array<IInFlightRequest | null> = [];

  /**
   * Serialized records loaded from disk.
   */
  private mocks: SerializedRequestResponse[] = [];
  private redactSymbol: string;
  private interceptor: Interceptor | undefined;

  constructor(options?: YesNoOptions) {
    const { mode = Mode.Spy, redactSymbol = DEFAULT_REDACT_SYMBOL, dir }: YesNoOptions =
      options || {};
    this.mode = mode;
    this.dir = dir;
    this.redactSymbol = redactSymbol;
  }

  public enable(): YesNo {
    debug('Enabling intercept');

    this.interceptor = new Interceptor({ mitm: Mitm(), shouldProxy: !this.isMode(Mode.Mock) });
    this.interceptor.on(
      'intercept',
      ({
        requestSerializer,
        interceptedRequest,
        interceptedResponse,
        requestNumber,
      }: IInterceptEvent) => {
        this.inFlightRequests[requestNumber] = {
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
    this.interceptor.on(
      'proxied',
      ({ requestSerializer, responseSerializer, requestNumber }: IProxiedEvent) => {
        this.recordCompleted(
          requestSerializer.serialize(),
          responseSerializer.serialize(),
          requestNumber,
        );
      },
    );

    return this;
  }

  public disable(): void {
    if (!this.interceptor) {
      throw new YesNoError('Cannot disable if not enabled');
    }

    // If running in "cli" mode, could prompt to save mocks now...
    this.clear();
    this.interceptor.disable();
    this.interceptor = undefined;
  }

  /**
   * Begin mock mode. Will load mocks with given name.
   * @param name Unique name for mocks
   */
  public async mock(name: string): Promise<SerializedRequestResponse[]> {
    this.setMode(Mode.Mock);
    this.mocks = await this.load(name);

    return this.mocks;
  }

  /**
   * Begin spy mode.
   */
  public spy() {
    this.setMode(Mode.Spy);
  }

  public setMode(mode: Mode) {
    this.mode = mode;

    if (this.interceptor) {
      this.interceptor.proxy(!this.isMode(Mode.Mock));
    }
  }

  /**
   * Save intercepted request/response if we're in record mode.
   * Clears local copy of intercepted request.
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

    const interceptedRequests = this.completedRequests;
    const inFlightRequests = this.inFlightRequests.filter((x) => x) as IInFlightRequest[];

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

    // Should we clear here?

    if (this.isMode(Mode.Mock)) {
      debug('No need to save in mock mode');
      return Promise.resolve();
    }

    debug('Saving %s...', name);

    return new Promise((resolve, reject) => {
      const payload: ISaveFile = { records: interceptedRequests };
      const contents = JSON.stringify(payload, null, 2);
      const filename = this.getMockFilename(name, dir as string);
      debug('Saving %d records to %s', interceptedRequests.length, filename);

      writeFile(filename, contents, (e: Error) => (e ? reject(e) : resolve(filename)));
    });
  }

  /**
   * Determine the current mode
   */
  public isMode(mode: Mode): boolean {
    return this.mode === mode;
  }

  /**
   * Clear all stateful information about requests.
   *
   * If used in a test suite, this should be called after each test.
   */
  public clear() {
    this.completedRequests = [];
    this.inFlightRequests = [];
    this.mocks = [];
    (this.interceptor as Interceptor).requestNumber = 0;
  }

  /**
   * Get the generated filename for a mock name.
   */
  public getMockFilename(name: string, dir: string): string {
    return path.join(dir, `${name}-yesno.json`);
  }

  /**
   * Get all intercepted request/response which match the provided query
   *
   * Match against the URL if query is a string or regexp.
   * Otherwise perform a partial match against each serialized request response
   * @param query
   */
  public intercepted(query?: string | RegExp | IQueryIntercepted) {
    if (!query) {
      return this.completedRequests;
    }

    if (_.isString(query) || _.isRegExp(query)) {
      query = { url: query };
    }

    return this.completedRequests.filter(this.doesMatchInterceptedFn(query));
  }

  /**
   * Load request/response mocks from disk
   * @param name Mock name
   * @param dir Override default directory
   */
  public load(name: string, dir?: string): Promise<SerializedRequestResponse[]> {
    dir = dir || this.dir;
    if (dir === undefined) {
      return Promise.reject(new YesNoError('Cannot load mock without configured dir'));
    }

    const filename = this.getMockFilename(name, dir);

    return this.loadMocks(filename);
  }

  public redact(
    records: SerializedRequestResponse[],
    property: string | string[],
    redactSymbol?: string | ((value: any) => any),
  ): void {
    redactSymbol = redactSymbol || this.redactSymbol;
  }

  /**
   * Curried function to determine whether a query matches an intercepted request.
   *
   * Query objects must be a deep partial match against the intercepted request.
   *
   * RegEx values are tested for match.
   */
  private doesMatchInterceptedFn(
    query: IQueryIntercepted,
  ): (intercepted: SerializedRequestResponse) => boolean {
    const equalityOrRegExpDeep = (reqResValue: any, queryValue: any): boolean => {
      if (queryValue instanceof RegExp) {
        return queryValue.test(reqResValue);
      } else if (_.isPlainObject(queryValue)) {
        // Add a depth limit?
        return _.isMatchWith(reqResValue, queryValue, equalityOrRegExpDeep);
      } else {
        return queryValue === reqResValue;
      }
    };

    return (intercepted: SerializedRequestResponse): boolean => {
      let isMatch = true;

      if (query.url) {
        isMatch = isMatch && equalityOrRegExpDeep(intercepted.url, query.url);
      }

      if (query.request) {
        isMatch =
          isMatch && _.isMatchWith(intercepted.request, query.request, equalityOrRegExpDeep);
      }

      if (query.response) {
        isMatch =
          isMatch && _.isMatchWith(intercepted.response, query.response, equalityOrRegExpDeep);
      }

      return isMatch;
    };
  }

  private loadMocks(filename: string): Promise<SerializedRequestResponse[]> {
    debug('Loading mocks from', filename);

    return new Promise((resolve, reject) => {
      readFile(filename, (e: Error, data: Buffer) => {
        if (e) {
          return reject(e);
        }

        resolve((JSON.parse(data.toString()) as ISaveFile).records);
      });
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
    const mock = this.mocks[requestNumber];

    if (!mock) {
      throw new YesNoError(`No mock found for request #${requestNumber}`);
    }

    this.assertMatches(serializedRequest, mock.request, requestNumber);

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
    const duration = now - (this.inFlightRequests[requestNumber] as IInFlightRequest).startTime;

    this.completedRequests[requestNumber] = {
      __duration: duration,
      __timestamp: now,
      __version: version,
      request,
      response,
      url,
    };
    this.inFlightRequests[requestNumber] = null;

    debug('Added request-response for %s %s (duration: %d)', request.method, url, duration);
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
      currentRequest.method,
      `YesNo: Expected request #${requestNum} for ${host} to use the ${mockRequest.method} method`,
    ).to.eql(mockRequest.method);

    expect(
      currentRequest.protocol,
      `YesNo: Expected request #${requestNum} for ${host} to be served over ${
        mockRequest.protocol
      }`,
    ).to.eql(mockRequest.protocol);

    expect(
      currentRequest.port,
      `YesNo: Expected request #${requestNum} for ${host} to be served on port ${mockRequest.port}`,
    ).to.eql(mockRequest.port);

    const nickname = `${currentRequest.method} ${currentRequest.protocol}://${
      currentRequest.host
    }:${currentRequest.port}`;

    // @todo check auth part

    expect(
      currentRequest.path,
      `YesNo: Expected request #${requestNum} "${nickname}" to have path ${mockRequest.path}`,
    ).to.eql(mockRequest.path);
  }

  private formatUrl(request: SerializedRequest) {
    return `${request.protocol}://${request.host}:${request.port}${request.path}`;
  }
}
