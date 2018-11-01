# YesNo

YesNo is an HTTP testing library for NodeJS that uses [Mitm](https://github.com/moll/node-mitm) to intercept outgoing HTTP requests. YesNo provides a simple API to access, manipulate and record requests, using mocks or live services, so that you can easily define what requests should and should not be made by your app.

- [Why?](#Why)
- [Installation](#installation)
- [Usage](#Usage)
  - [Intercepting live requests](#link)
  - [Providing mocks](#link)
  - [Recording requests](#recording-mocks)
  - [Filtering results](#link)
  - [Customizing behavior](#link)
- [API](#API)
- [CLI](#CLI)

## Why?

NodeJS applications often need to generate HTTP requests, whether that is to orchestrate across internal microservices, integrate with third party APIs or whatever. Because the correct behavior of the app is usually dependent on _sending the correct request_ and _receiving the correct response_, it's important that our tests properly validate our HTTP requests. We can accomplish this through a mix of _spying_ and _mocking_. 

Whereas a naive approach would be to mock the method calls to our request library or configure our application to make requests to a test server, YesNo uses [Mitm](https://github.com/moll/node-mitm) to intercept HTTP requests at the lowest level possible in process. **This allows us to access the request that is _actually_ generated by the application and return an _actual_ response, meaning we can test the actual HTTP behavior of our application, not the behavior of our mocks.** 

YesNo's sole purpose is to provide an easy interface to intercepting requestings and defining mocks. You are free to use your existing assertion library to validate requests.

## Installation

```
npm i --save-dev yesno-http
```

## Usage

### Intercepting live requests

To begin intercepting requests all we need to do is to call `yesno.spy()`. Afterwards we can access any _finished_ requests we've intercepted by calling `yesno.intercepted()`. The request's still sent unmodified to its destination, and the client still receives the unmodified response - we just maintain a serialized reference.

```javascript
const { yesno } = require('yesno-http');
const { expect } = require('chai');
const myApi = require('../src/my-api');

describe('my-api', () => {
  it('should get users', () => {
    yesno.spy(); // Intercept requests
    const users = await myApi.getUsers();
    const intercepted = yesno.intercepted(); // Get the intercepted requests

    // Intercepted requests have a standardized format
    expect(intercepted).have.lengthOf(1);
    expect(intercepted[0]).have.nested.property('url', 'https://api.example.com/users');
    expect(users).to.eql(intercepted[0].response.body.users); // JSON bodies are parsed to objects
  })
});
```

Here we assert that _only 1_ HTTP request was generated by `myApi.getUsers()` , that the request was for the _correct URL_ and that the return value is equal to the `users` property of the JSON response body. YesNo will automatically parse the body of JSON requests/responses into an object - otherwise the body will be a string (see [ISerializedHttp](#ISerializedHttp) for the serialized request format).

_Note:_ By [default](link) YesNo only intercepts requests for ports 80 (HTTP) & 443 (HTTPS).

### Mocking responses

A lot of the time when unit testings we don't want our requests to hit any external services, but we still want to validate the correct request _would_ be generated. In this case we can call `yesno.mock()`, which will intercept generated HTTP requests and respond with a provided mock response.

```javascript
yesno.mock([{
  request: {
    method: 'POST',
    path: '/users',
    host: 'example.com',
    protocol: 'https'
  },
  response: {
    headers: {
      'x-test-header': 'fizbaz'
    },
    body: {
      users: [{ username: 'foobar' }]
    },
    statusCode: 200
  }
}]);

const users = await myApi.getUsers();

expect(users).to.eql(yesno.mocks()[0].response.body.users);
```

YesNo first checks to make sure the request generated by `myApi.getUser()` has the same URL as our mock, then responds with the body, status code and headers in our response.

### Recording Requests

While mocking is useful mocks themselves are hard to maintain. When APIs changes (sometimes unexpectedly!) our mocks become stale, meaning we're testing for the wrong behavior. To solve this problem YesNo allows you to _record_ requests, saving the requests we've intercepted to a local file.

```javascript
yesno.spy();
await myApi.getUsers();

yesno.save({ filename: './get-users.json' });
```

After we've saved the records to disk, we can update our test to load its mocks from the records.

```javascript
yesno.mock(await yesno.load({ filename: './get-users-mocks.json' }));
await myApi.getUsers();
```

This workflow has the advantage of ensuring that our mocks closely reprent the _real_ HTTP request/responses our application deals with and making it easy to refresh these mocks when an API has been updated.

Since it's a common pattern, the save & load methods alternatively accept the test name and a directory to store the mocks, from which it will generate the filename.

```javascript
yesno.mock(await yesno.load(testName, mockDir));
```

### Filtering results
 
Once requests have finished we still need assert that the requests were correct. We've already seen `yesno.intercepted()`, which returns _all_ the intercepted requests, but this is just shorthand for `yesno.matching().intecepted()`, which we can use to selectively access requests.

Consider the following, where we use `yesno.matching()` to access only the intercepted user request, then assert a password was hashed.

```
yesno.spy();

await myApi.complicatedAuthFlow(token); // Lots of HTTP requests!
await myApi.updateUser(userId, rawPassword);

expect(
  // Match only requests with this url
  yesno.matching(`https://example.com/users/${userId}`).intercepted()[0]
).to.have.nested.property("request.body.password", hash(rawPassword));
```

We can even use this syntax to selectively redact values from the serialized requests, so that we don't persist sensitive data to our mocks. This is a common problem when auth tokens are being sent back and forth between the APIs.

```
await myApi.complicatedAuthFlow(token); // Lots of HTTP requests!
await myApi.updateUser(userId, rawPassword);

yesno.matching(/auth/).redact(['request.headers.authorization', 'response.body.token']);


expect(yesno.matching(/auth/).intercepted()).to.have.nested.property(
  'request.headers.authorization', '*****');

await yesno.save(testName, dir); // Recorded mocks are sanitized
```

The matching method can filter on any of the properties in the serialized object. See the API documentation for more examples.

### Restoring HTTP behavior

When we no longer need YesNo to intercept requests we can call `yesno.restore()`. This will completely restore HTTP behavior & clear our mocks. It's advisable to run this after every test.

```javascript
describe('api', () => {
  beforeEach(() => yesno.spy()); // Spy on each test
  afterEach(() => yesno.restore()); // Cleanup!

  describe('lots of tests with lots of requests', () => { ... });
});
```

## API

YesNo is written in [TypeScript](link) and uses its type syntax where possible.

##### [`YesNo`](#YesNo)
- [`yesno.spy(options?: IInterceptOptions): void`](link);
- [`yesno.mock(mocks?: HttpMock[], options?: IInterceptOptions): void`](link);
- [`yesno.restore(): void`](link);
- [`yesno.save(name: string, dir: string): Promise<void>`](link) (+1 overload)
- [`yesno.load(name: string, dir: string): Promise<ISerializedHttp[]>`](link) (+1 overload);
- [`yesno.matching(query: HttpFilter): FilteredHttpCollection`](link);

##### [`FilteredHttpCollection`](#FilteredHttpCollection)
- [`collection.mocks(): ISerializedHttp[]`](link);
- [`collection.intercepted(): ISerializedHttp[]`](link);
- [`collection.redact(): void`](link);
- [`collection.comparator(): void`](link);

##### [`ISerializedHttp`](link)
##### [`YesNoError`](link)

### `YesNo`

The `yesno` instance implements all the methods of the `FilteredHttpCollection` interface.

##### `yesno.spy(options?: IInterceptOptions): void`


Enables intercept of requests if not already enabled and configures YesNo to `spy` mode.

##### `IInterceptOptions`

`options.ports: number[]`: Non-standard ports for which to intercept requests. Use this if you need to make a request to eg `localhost:3001`. YesNo will always intercept requests with ports `80` or `443`.

##### `yesno.mock(mocks: ISerializedHttp[] | ISerializedHttpMock[], options?: IInterceptOptions): void`

Enables intercept of requests if not already enabled and configures YesNo to `mock` mode, using the provided `mocks` to respond to requests.

YesNo responds to the Nth intercepted request with the Nth mock. If the HTTP method & URL of the intercepted request does not match the corresponding mock then client request will fail.

When YesNo cannot provide a mock for an intercept it emits an `error` event on the corresponding [`ClientRequest`](link) instance. Most libraries will handle this by throwing an error.

See also [`IInterceptOptions`](#IInterceptOptions).

##### `yesno.restore(): void`

Restore normal HTTP functionality by disabling Mitm & restoring any defined stubs. Clears references to any stateful properties such as the defined mocks or intercepted requests.

If you're using YesNo in a test suite it's advisable to run this method after every test case.

##### `yesno.save(name: string, dir: string): Promise<void>`
##### `yesno.save(options: IFileOptions & ISaveOptions): Promise<void>`

Save serialized HTTP requests to disk. Will save currently intercepted requests unless records are provided to method. 

This method will throw an error if there are any in flight requests.

##### `yesno.load(name: string, dir: string): Promise<ISerializedHttp[]>`
##### `yesno.load(options: IFileOptions): Promise<ISerializedHttp[]>`

Load mocks from disk. Mocks will be returned. To use mocks you must pass them to `yesno.mock()`.

##### `yesno.matching(matcher: HttpFilter): FilteredHttpCollection`

Apply a filter to subsequently access or manipulate matching mocks or intercepted requests.

We define an `HttpFilter` as: `type HttpFilter = string | RegExp | IHttpMatch | (serialized: ISerializedHttp, index: number) => boolean`;

The `matcher` is applied to each serialized request to filter results. If the matcher is...

- A string: Perform an _exact_ match on URL (port optional)
- A regular expression: Test against URL (port optional)
- An object (`IHttpMatch`): Perform a deep partial comparison against the serialized request
- A function: A callback that receives the `ISerializedHttp` object and returns a `boolean` value of `true` to indicate match.

Examples:

```
yesno.matching('https://api.example.com/users'); // Exact match on url
yesno.matching(/example/); // Any request to Example website
yesno.matching({ // Any POST requests to Example with status code of 500
  request: { host: 'example.com', method: 'POST' },
  response: { statusCode: 500 }
});
yesno.matching((serialized, i) => {
  if (i === 0) { // First request
    return true;
  }

  const { request } = serialized;
  if (request.body.firstName === request.body.lastName) { // Custom logic
    return true;
  }

  return false;
});
```

### `FilteredHttpCollection`

##### `collection.mocks(): ISerializedHttp[]`

Return the mocks defined within the collection.

##### `collection.intercepted(): ISerializedHttp[]`

Return the intercepted requests defined within the collection.

##### `collection.redact(property: string | string[], redactor: Redactor = () => "*****"): void`

Redact properties on intercepted requests within the collection.

##### `collection.comparator((intercepted: ISerializedRequest, mock: ISerializedRequest) => boolean): void`

_Not yet implemented!_

Provide a custom comparator to use with mocks within the collection. The comparator is used to determine whether an intercepted request matches a mock. Use this method to make mocking more or less strict, which can reduce/increase the need to validate intercepted requests afterward. YesNo ships with the comparators `comparators.url`, `comparators.body`, `comparators.headers`. By default YesNo will use `comparators.url` (least strict).

You can compose comparators to mix and match behavior:

```javascript
const { comparators } = require('yesno-http');
const { flow } = require('lodash'); // Composition helper

const compareAuthHeader = (intercepted, mock) => intercepted.headers.authorization === mock.headers.authorization;
yesno.matching(/auth/).comparator(flow(comparators.url, compareAuthHeader));
```

#### ISerializedHttp

```typescript
interface ISerializedHttp {
  readonly __id: string;
  readonly __version: string;
  readonly __timestamp: number;
  readonly __duration: number;
  readonly url: string;
  readonly request: SerializedRequest;
  readonly response: SerializedResponse;
}

export interface SerializedResponse {
  readonly body: string | object;
  readonly headers: IncomingHttpHeaders;
  readonly statusCode: number;
}

export interface SerializedRequest {
  readonly body?: string | object;
  readonly headers: OutgoingHttpHeaders;
  readonly host: string;
  readonly path: string;
  readonly method: string;
  readonly port: number;
  readonly query?: string;
  readonly protocol: 'http' | 'https';
}
```

### CLI

TODO

### Roadmap

YesNo is still a work in progress. The below features are planned or in consideration.

- Support non-deterministic order of HTTP requests.
- Detect HTTP requests by some heuristic other than port so user does not need to configure YesNo for non-standard ports.
- Support `comparator`
- Apply redact to incoming requests