import * as assert from 'assert';
import { YesNoError } from '../errors';
import { SerializedRequest } from '../http-serializer';

interface IComparatorMetadata {
  requestIndex: number;
}

type ComparatorFn = (
  intercepted: SerializedRequest,
  mock: SerializedRequest,
  metadata: IComparatorMetadata,
) => boolean;

// @todo Do not bother using chai
// @todo Change to return type `Either<Error, SerializedRequest>`
export const byUrl: ComparatorFn = (interceptedRequest, mockRequest, { requestIndex }): boolean => {
  assertEqual(
    interceptedRequest.host,
    mockRequest.host,
    `Expected host "${mockRequest.host}" for request #${requestIndex}, received "${
      interceptedRequest.host
    }"`,
  );
  const { host } = interceptedRequest;

  assertEqual(
    interceptedRequest.method,
    mockRequest.method,
    `Expected request #${requestIndex} for ${host} to HTTP method "${mockRequest.method}", not "${
      interceptedRequest.method
    }"`,
  );

  assertEqual(
    interceptedRequest.protocol,
    mockRequest.protocol,
    `Expected request #${requestIndex} for ${host} to use "${
      mockRequest.protocol
    }" protocol, not "${interceptedRequest.protocol}"`,
  );

  assertEqual(
    interceptedRequest.port,
    mockRequest.port,
    `Expected request #${requestIndex} for ${host} to be served on port "${
      mockRequest.port
    }", not "${interceptedRequest.port}"`,
  );

  const nickname = `${interceptedRequest.method} ${interceptedRequest.protocol}://${
    interceptedRequest.host
  }:${interceptedRequest.port}`;

  assertEqual(
    interceptedRequest.path,
    mockRequest.path,
    `Expected request #${requestIndex} "${nickname}" to have path "${mockRequest.path}", not "${
      interceptedRequest.path
    }"`,
  );

  return true;
};

function assertEqual<T>(unknown: T, known: T, message: string): void {
  assert.strictEqual(unknown, known, new YesNoError(`Request does not match mock. ${message}`));
}
