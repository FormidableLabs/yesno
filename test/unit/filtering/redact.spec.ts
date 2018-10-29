import { expect } from 'chai';
import _ from 'lodash';
import { DEFAULT_REDACT_SYMBOL } from '../../../src/consts';

import { redact } from '../../../src/filtering/redact';
import { ISerializedHttp } from '../../../src/http-serializer';

describe('redact#redact', () => {
  const serialized = (): ISerializedHttp => ({
    __duration: 0,
    __id: 'id',
    __timestamp: 0,
    __version: 'mock',
    request: {
      body: { foo: { bar: false } },
      headers: {
        'content-type': 'application/json',
        'x-test-header': 'fizbaz',
      },
      host: 'api.foobar.com',
      method: 'POST',
      path: '/my/path',
      port: 443,
      protocol: 'https',
      query: '?foo=bar',
    },
    response: {
      body: 'foobar',
      headers: {
        'content-type': 'text/plain',
      },
      statusCode: 200,
    },
  });

  it('should allow redacting multiple properties', () => {
    const original = serialized();
    const redacted = redact(original, ['response.body', 'request.headers.x-test-header']);

    expect(redacted, 'No mutation').to.not.eql(original);
    expect(redacted).to.have.nested.property('response.body', DEFAULT_REDACT_SYMBOL);
    expect(redacted).to.have.nested.property(
      'request.headers.x-test-header',
      DEFAULT_REDACT_SYMBOL,
    );
  });

  it('should allow redacting properties nested within arrays');
  it('should ignore properties absent in the request');
  it('should support overriding the redact symbol');
  it('should support a callback to customize redacting');
});
