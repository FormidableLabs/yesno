import { expect } from 'chai';
import { match } from '../../../src/filtering/matcher';
import { SerializedRequestResponse } from '../../../src/http-serializer';

describe('matcher', () => {
  const serialized = (): SerializedRequestResponse => ({
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

  it('should match a request by an exact URL match', () => {
    expect(match({ url: 'https://api.foobar.com/my/path?foo=bar' })(serialized())).to.be.true;
    expect(
      match({ url: 'https://api.foobar.com:443/my/path?foo=bar' })(serialized()),
      'Optionally include port',
    ).to.be.true;
    expect(match({ url: 'https://api.fizbaz.com/my/path?foo=bar' })(serialized())).to.be.false;
    expect(match({ url: 'https://api.foobar.com/my/path' })(serialized())).to.be.false;
  });

  it('should match a request by a regex URL match', () => {
    expect(match({ url: /api\.foobar\.com\/my/ })(serialized())).to.be.true;
    expect(match({ url: /api\.foobar\.com:443\/my/ })(serialized()), 'Optionally include port').to
      .be.true;
    expect(match({ url: /^api/ })(serialized())).to.be.false;
  });

  it('should match a request by a deep partial object match', () => {
    const s = serialized();

    expect(match({ request: { method: 'POST' } })(s), 'Request').to.be.true;
    expect(match({ request: { method: 'GET' } })(s), 'Request').to.be.false;
    expect(
      match({ request: { method: 'POST' }, response: { statusCode: 200 } })(s),
      'Request & response',
    ).to.be.true;
    expect(
      match({ request: { method: 'POST' }, response: { statusCode: 500 } })(s),
      'Request & response no match',
    ).to.be.false;
    expect(
      match({ request: { method: 'POST', body: { foo: { bar: false } } } })(s),
      'Deep partial match',
    ).to.be.true;
    expect(
      match({ request: { method: 'POST', body: { foo: { bar: true } } } })(s),
      'Deep partial no match',
    ).to.be.false;
    expect(
      match({ url: /foobar/, request: { method: 'POST', body: { foo: { bar: false } } } })(s),
      'URL Regex & deep partial match',
    ).to.be.true;
    expect(
      match({ url: /fizbaz/, request: { method: 'POST', body: { foo: { bar: false } } } })(s),
      'URL Regex & deep partial no match',
    ).to.be.false;
  });

  it('should match against arrays in JSON bodies', () => {
    const s = serialized();
    (s.request.body as any) = { users: [{ id: 1, i: 0 }, { id: 2, i: 1 }] };

    expect(
      match({ request: { body: { users: [{ id: 1, i: 0 }, { id: 2, i: 1 }] } } })(s),
      'Array exact match',
    ).to.be.true;
    expect(
      match({ request: { body: { users: [{ id: 1 }, { id: 2 }] } } })(s),
      'Partial match of all values in array',
    ).to.be.true;
    expect(match({ request: { body: { users: [{ id: 1, i: 0 }] } } })(s), 'Array shortened matches')
      .to.be.true;
    expect(match({ request: { body: { users: [] } } })(s), 'Array empty matches').to.be.true;
    expect(
      match({ request: { body: { users: [{ id: 1, i: 1 }] } } })(s),
      'Array wrong value mismatch',
    ).to.be.false;
    expect(
      match({ request: { body: { users: [{ id: 2, i: 1 }] } } })(s),
      'Array missing element mismatch',
    ).to.be.false;
    expect(match({ request: { body: {} } })(s)).to.be.true;
  });

  it('should test leaf nodes which are regular expressions');

  it('should match a request according to a callback return value', () => {
    expect(match(() => true)(serialized())).to.be.true;
    expect(match(() => false)(serialized())).to.be.false;
    expect(match((toMatch) => toMatch.request.path === '/my/path')(serialized())).to.be.true;
    expect(match((toMatch) => toMatch.request.path !== '/my/path')(serialized())).to.be.false;
  });
});
