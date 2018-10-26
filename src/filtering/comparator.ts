import { expect } from 'chai';
import { YesNoError } from '../errors';
import { SerializedRequest } from '../http-serializer';

// @todo Do not bother using chai
export function byUrl(
  interceptedRequest: SerializedRequest,
  mockRequest: SerializedRequest,
  requestNum: number,
): void {
  try {
    expect(
      interceptedRequest.host,
      `Expected host "${mockRequest.host}" for request #${requestNum}, received "${
        interceptedRequest.host
      }"`,
    ).to.eql(mockRequest.host);
    const { host } = interceptedRequest;

    expect(
      interceptedRequest.method,
      `Expected request #${requestNum} for ${host} to HTTP method "${mockRequest.method}", not "${
        interceptedRequest.method
      }"`,
    ).to.eql(mockRequest.method);

    expect(
      interceptedRequest.protocol,
      `Expected request #${requestNum} for ${host} to use "${
        mockRequest.protocol
      }" protocol, not "${interceptedRequest.protocol}"`,
    ).to.eql(mockRequest.protocol);

    expect(
      interceptedRequest.port,
      `Expected request #${requestNum} for ${host} to be served on port "${
        mockRequest.port
      }", not "${interceptedRequest.port}"`,
    ).to.eql(mockRequest.port);

    const nickname = `${interceptedRequest.method} ${interceptedRequest.protocol}://${
      interceptedRequest.host
    }:${interceptedRequest.port}`;

    expect(
      interceptedRequest.path,
      `Expected request #${requestNum} "${nickname}" to have path "${mockRequest.path}", not "${
        interceptedRequest.path
      }"`,
    ).to.eql(mockRequest.path);
  } catch (e) {
    const error = new YesNoError(`Request does not match mock. ${e.message}`);
    throw error;
  }
}
