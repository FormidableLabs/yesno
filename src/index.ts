import { expect } from 'chai';
import { IDebugger } from 'debug';
import { readFile, writeFile } from 'fs';
import * as http from 'http';
import * as _ from 'lodash';
import Mitm = require('mitm');
import { EOL } from 'os';
import * as path from 'path';
import * as readable from 'readable-stream';
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

interface IInFlightRequest {
  startTime: number;
  requestSerializer: RequestSerializer;
}

export interface ISaveFile {
  records: SerializedRequestResponse[];
}

// tslint:disable-next-line:max-classes-per-file
export class YesNo {
  /**
   * Completed serialized request-response objects. Used for:
   * A. Assertions
   * B. Saved to disk if in record mode
   */
  public completedRequests: SerializedRequestResponse[] = [];

  /**
   * Proxied requests which have not yet responded. When completed
   * the value is set to "null" but the index is preserved.
   */
  private inFlightRequests: Array<IInFlightRequest | null> = [];

  /**
   * Serialized records loaded from disk.
   */
  private mocks: SerializedRequestResponse[] = [];

  private mode: Mode;
  private dir: string;
  private currentName: string | undefined;
  private interceptor: Interceptor | undefined;

  constructor({ mode = Mode.Spy, dir }: YesNoOptions) {
    this.mode = mode;
    this.dir = dir;
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

    this.interceptor.disable();
    this.interceptor = undefined;
  }

  public async begin(name: string, mode?: Mode): Promise<void> {
    if (!this.interceptor) {
      throw new YesNoError('Cannot begin until enabled');
    }

    this.currentName = name;

    if (mode !== undefined) {
      this.mode = mode;
      this.interceptor.proxy(!this.isMode(Mode.Mock));
    }

    if (this.isMode(Mode.Mock)) {
      await this.load(this.currentName);
    }
  }

  /**
   * Save intercepted request/response if we're in record mode.
   * Clears local copy of intercepted request.
   * @returns Full filename of saved JSON if generated
   */
  public save(): Promise<string | void> {
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

    if (!this.isMode(Mode.Record)) {
      debug('Not in record mode, will not persist records');
      return Promise.resolve();
    }

    debug('Saving %s...', this.currentName);

    return new Promise((resolve, reject) => {
      const payload: ISaveFile = { records: interceptedRequests };
      const contents = JSON.stringify(payload, null, 2);
      const filename = this.getMockFilename(this.currentName as string);
      debug('Saving %d records to %s', interceptedRequests.length, filename);

      writeFile(filename, contents, (e: Error) => (e ? reject(e) : resolve(filename)));
    });
  }

  public useDir(dir: string): YesNo {
    this.dir = dir;
    return this;
  }

  public isMode(mode: Mode): boolean {
    return this.mode === mode;
  }

  public clear() {
    this.completedRequests = [];
    this.inFlightRequests = [];
    this.mocks = [];
    (this.interceptor as Interceptor).requestNumber = 0;
  }

  public getMockFilename(name: string): string {
    return path.join(this.dir, `${name}-yesno.json`);
  }

  private load(name: string): Promise<SerializedRequestResponse[] | void> {
    if (!this.isMode(Mode.Mock)) {
      return Promise.reject(new YesNoError('Cannot load mocks outside mock mode'));
    }

    return new Promise((resolve, reject) => {
      const filename = path.join(this.dir, `${name}-yesno.json`);
      debug('Loading mocks from', filename);

      readFile(filename, (e: Error, data: Buffer) => {
        if (e) {
          return reject(e);
        }

        this.mocks = (JSON.parse(data.toString()) as ISaveFile).records;
        resolve(this.mocks);
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
