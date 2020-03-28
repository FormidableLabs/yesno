import { IDebugger } from 'debug';
import * as _ from 'lodash';
import * as readable from 'readable-stream';

import Context from './context';
import { YesNoError } from './errors';
import * as comparator from './filtering/comparator';
import { ISerializedHttp, ISerializedRequest } from './http-serializer';
import { IInterceptEvent } from './interceptor';

const debug: IDebugger = require('debug')('yesno:mock-response');

export default class MockResponse {
  private event: IInterceptEvent;
  private ctx: Context;

  constructor(event: IInterceptEvent, ctx: Context) {
    this.ctx = ctx;
    this.event = event;
  }

  public async send(): Promise<Pick<ISerializedHttp, 'request' | 'response'>> {
    const {
      comparatorFn,
      interceptedRequest,
      interceptedResponse,
      requestSerializer,
      requestNumber,
    } = this.event;

    debug(`[#${requestNumber}] Mock response`);
    const mock = this.getMockForIntecept(this.event);
    await (readable as any).pipeline(interceptedRequest, requestSerializer);

    const serializedRequest = requestSerializer.serialize();

    // Assertion must happen before promise -
    // mitm does not support promise rejections on "request" event
    this.assertMockMatches({ mock, serializedRequest, requestNumber, comparatorFn });
    this.writeMockResponse(mock, interceptedResponse);

    return {
      request: serializedRequest,
      response: mock.response,
    };
  }

  private getMockForIntecept({ requestNumber }: IInterceptEvent): ISerializedHttp {
    const mock = this.ctx.loadedMocks[requestNumber];

    if (!mock) {
      throw new YesNoError('No mock found for request');
    }

    return mock;
  }

  private assertMockMatches({
    mock,
    serializedRequest,
    comparatorFn,
    requestNumber,
  }: { mock: ISerializedHttp; serializedRequest: ISerializedRequest } & Pick<
    IInterceptEvent,
    'comparatorFn' | 'requestNumber'
  >): void {
    try {
      // determine how we'll compare the request and the mock
      const compareBy: comparator.ComparatorFn = comparatorFn || comparator.byUrl;

      // the comparison function must throw an error to signal a mismatch
      compareBy(serializedRequest, mock.request, { requestIndex: requestNumber });
    } catch (err) {
      // ensure any user-thrown error is wrapped in our YesNoError
      throw new YesNoError(err.message);
    }
  }

  private writeMockResponse(
    mock: ISerializedHttp,
    interceptedResponse: IInterceptEvent['interceptedResponse'],
  ): void {
    const bodyString = _.isPlainObject(mock.response.body)
      ? JSON.stringify(mock.response.body)
      : (mock.response.body as string);

    const responseHeaders = { ...mock.response.headers };
    if (
      responseHeaders['content-length'] &&
      parseInt(responseHeaders['content-length'] as string, 10) !== Buffer.byteLength(bodyString)
    ) {
      responseHeaders['content-length'] = Buffer.byteLength(bodyString);
    }

    interceptedResponse.writeHead(mock.response.statusCode, responseHeaders);
    interceptedResponse.write(bodyString);
    interceptedResponse.end();
  }
}
