[![Build Status](https://travis-ci.com/FormidableLabs/yesno.svg?branch=main)](https://travis-ci.com/FormidableLabs/yesno)
[![codecov](https://codecov.io/gh/FormidableLabs/yesno/branch/main/graph/badge.svg)](https://codecov.io/gh/FormidableLabs/yesno)
[![Maintenance Status][maintenance-image]](#maintenance-status)


# YesNo

YesNo is an HTTP testing library for NodeJS that uses [Mitm](https://github.com/moll/node-mitm) to intercept outgoing HTTP requests. YesNo provides a simple API to access, manipulate and record requests, using mocks or live services, so that you can easily define what requests should and should not be made by your app.

_Note:_ YesNo is still in beta! We're actively working toward our [first major release](https://github.com/FormidableLabs/yesno/projects/1), meaning the API is subject to change. Any and all feedback is appreciated.

- [Why?](#Why)
- [Installation](#installation)
- [Usage](#Usage)
  - [Intercepting live requests](#intercepting-live-requests)
  - [Mocking responses](#mocking-responses)
  - [Recording requests](#recording-requests)
  - [Filtering results](#filtering-results)
  - [Restoring HTTP behavior](#restoring-http-behavior)
- [Examples](#Examples)
- [API](#API)

## Why?

NodeJS applications often need to generate HTTP requests, whether that is to orchestrate across internal microservices, integrate with third party APIs or whatever. Because the correct behavior of the app is usually dependent on _sending the correct request_ and _receiving the correct response_, it's important that our tests properly validate our HTTP requests. We can accomplish this through a mix of _spying_ and _mocking_.

Whereas a naive approach would be to mock the method calls to our request library or configure our application to make requests to a test server, YesNo uses [Mitm](https://github.com/moll/node-mitm) to intercept HTTP requests at the lowest level possible in process. **This allows us to access the request that is _actually_ generated by the application and return an _actual_ response, meaning we can test the actual HTTP behavior of our application, not the behavior of our mocks.**

YesNo's sole purpose is to provide an easy interface to intercepting requests and defining mocks. You are free to use your existing assertion library to validate requests.

## Installation

```
npm i --save-dev yesno-http
```

## Usage

_To see our preferred usage, skip to [recording](#recording-requests)!_

### Intercepting live requests

To begin intercepting requests all we need to do is to call `yesno.spy()`. Afterwards we can access any _finished_ requests we've intercepted by calling `yesno.intercepted()`. The requests still sent unmodified to its destination, and the client still receives the unmodified response - we just maintain a serialized reference.

```javascript
const { yesno } = require('yesno-http');
const { expect } = require('chai');
const myApi = require('../src/my-api');

describe('my-api', () => {
 it('should get users', async () => {
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

### Mocking responses

A lot of the time when unit testings we don't want our app to hit any external services, but we still want to validate its HTTP behavior. In this case we can call `yesno.mock()`, which will intercept generated HTTP requests and respond with a provided mock response.

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

Mocks also allow us to easily test the behavior of our application when it receives "unexpected" responses, such as non-200 HTTP status codes or error response bodies.

### Recording Requests

While mocking is useful mocks themselves are hard to maintain. When APIs changes (sometimes unexpectedly!) our mocks become stale, meaning we're testing for the wrong behavior. To solve this problem YesNo allows you to _record_ requests, saving the requests we've intercepted to a local file.

```javascript
const recording = await yesno.recording({ filename: './get-users-yesno.json' });
await myApi.getUsers();
  expect(yesno.matching(/users/).response()).to.have.property('statusCode', 200);

recording.complete();
```

This workflow has the advantage of ensuring that our mocks closely represent the _real_ HTTP request/responses our application deals with and making it easy to refresh these mocks when an API has been updated.

To make this workflow even easier, YesNo includes a `test` method which accepts a jest or mocha style test statement and surrounds it with our record statements. Using the above as an example, we could rewrite it as:

```javascript
const itRecorded = yesno.test({ it, dir: `${__dirname}/mocks` })

// Mocks for this test will be saved to or loaded from
// "./mocks/get-users-yesno.json"
itRecorded('Get Users', async () => {
  await myApi.getUsers();
  expect(yesno.matching(/users/).response()).to.have.property('statusCode', 200);
})
```

Now we skip the recording boilerplate and just write our test!

In case you need to load and generate fixtures manually, YesNo also exposes the `save` and `load` methods that `record` uses internally.

### Filtering results
Once requests have finished we still need to assert that the requests were correct. We've already seen `yesno.intercepted()`, which returns _all_ the intercepted requests, but this is just shorthand for `yesno.matching().intercepted()`, which we can use to selectively access requests.

Consider the following, where we use `yesno.matching()` to access only the intercepted user request, then assert a password was hashed.

```javascript
yesno.spy();

await myApi.complicatedAuthFlow(token); // Lots of HTTP requests!
await myApi.updateUser(userId, rawPassword);

expect(
 // Match only requests with this url
 yesno.matching(`https://example.com/users/${userId}`).intercepted()[0]
).to.have.nested.property("request.body.password", hash(rawPassword));
```

We can even use this syntax to selectively redact values from the serialized requests, so that we don't persist sensitive data to our mocks. This is a common problem when auth tokens are being sent back and forth between the APIs.

```javascript
await myApi.complicatedAuthFlow(token); // Lots of HTTP requests!
await myApi.updateUser(userId, rawPassword);

yesno.matching(/auth/).redact(['request.headers.authorization', 'response.body.token']);


expect(yesno.matching(/auth/).intercepted()).to.have.nested.property(
 'request.headers.authorization', '*****');

await yesno.save(testName, dir); // Recorded mocks are sanitized
```

The matching method can filter on any of the properties in the serialized object. See the API documentation for more examples.

### Mocking matched results

Matched results can be replaced with static or dynamic mocked responses. Use the `.respond()` method on a filtered http collection to define the response.

```
yesno.matching(/get/).respond({ statusCode: 400 })

yesno.matching({ request: { path: '/post' } }) .respond((request) => ({ statusCode: 401, body: request.body }))
```

Responses defined in this way take precedence over normally loaded mocks.

### Ignoring matched mocks to proxy requests

Matched requests can ignore the defined mocks and proxy the request to the original host. This provides mixing of live and mocked results. Use the `.ignore()` method on a filtered http collection to disable the mock.

Matching requests set in this way take precedence over all defined and loaded mocks.

### Restoring HTTP behavior

When we no longer need YesNo to intercept requests we can call `yesno.restore()`. This will completely restore HTTP behavior & clear our mocks. It's advisable to run this after every test.

```javascript
describe('api', () => {
 beforeEach(() => yesno.spy()); // Spy on each test
 afterEach(() => yesno.restore()); // Cleanup!

 describe('lots of tests with lots of requests', () => { ... });
});
```

If you're using `yesno.test()` it'll call restore for you whenever it runs.

## Examples

Visit the [examples](https://github.com/FormidableLabs/yesno/tree/main/examples) directory to see sample tests written with YesNo.

You can run the tests yourselves after cloning the repo.

```sh
npm install
npm run example-server # Start test server
```

Then in a separate window

```sh
npm run example-tests
```

## API

YesNo is written in [TypeScript](typescriptlang.org) and uses its type syntax where possible.

To see typedoc generated documentation, click [here](./docs/README.md).

##### [`YesNo`](#YesNo)
- [YesNo](#yesno)
  - [Why?](#why)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Intercepting live requests](#intercepting-live-requests)
    - [Mocking responses](#mocking-responses)
    - [Recording Requests](#recording-requests)
    - [Filtering results](#filtering-results)
    - [Mocking matched results](#mocking-matched-results)
    - [Restoring HTTP behavior](#restoring-http-behavior)
  - [Examples](#examples)
  - [API](#api)
        - [`YesNo`](#yesno-1)
        - [`FilteredHttpCollection`](#filteredhttpcollection)
        - [`Recording`](#recording)
        - [`ISerializedHttp`](#iserializedhttp)
    - [`YesNo`](#yesno-2)
        - [`yesno.spy(options?: IInterceptOptions): void`](#yesnospyoptions-iinterceptoptions-void)
        - [`IInterceptOptions`](#iinterceptoptions)
        - [`yesno.mock(mocks: ISerializedHttp[] | ISerializedHttpMock[], options?: IInterceptOptions): void`](#yesnomockmocks-iserializedhttp--iserializedhttpmock-options-iinterceptoptions-void)
        - [`yesno.recording(options?: IInterceptOptions & IFileOptions): Promise<Recording>`](#yesnorecordingoptions-iinterceptoptions--ifileoptions-promiserecording)
        - [`yesno.test(options: IRecordableTest): (name: string, test: () => Promise<any>) => void`](#yesnotestoptions-irecordabletest-name-string-test---promiseany--void)
        - [`IRecordableTest`](#irecordabletest)
        - [`yesno.restore(): void`](#yesnorestore-void)
        - [`yesno.save(options: IFileOptions & ISaveOptions): Promise<void>`](#yesnosaveoptions-ifileoptions--isaveoptions-promisevoid)
        - [`IFileOptions`](#ifileoptions)
        - [`ISaveOptions`](#isaveoptions)
        - [`yesno.load(options: IFileOptions): Promise<ISerializedHttp[]>`](#yesnoloadoptions-ifileoptions-promiseiserializedhttp)
        - [`yesno.matching(filter?: HttpFilter): FilteredHttpCollection`](#yesnomatchingfilter-httpfilter-filteredhttpcollection)
    - [`FilteredHttpCollection`](#filteredhttpcollection-1)
        - [`collection.mocks(): ISerializedHttp[]`](#collectionmocks-iserializedhttp)
        - [`collection.ignore(): ISerializedHttp`](#collectionignore-iserializedhttp)
        - [`collection.intercepted(): ISerializedHttp[]`](#collectionintercepted-iserializedhttp)
        - [`collection.redact(property: string | string[], redactor: Redactor = () => "*****"): void`](#collectionredactproperty-string--string-redactor-redactor----%22%22-void)
        - [`collection.request(): ISerializedHttp`](#collectionrequest-iserializedhttp)
        - [`collection.respond(): ISerializedHttp`](#collectionrespond-iserializedhttp)
        - [`collection.response(): ISerializedHttp`](#collectionresponse-iserializedhttp)
      - [Recording](#recording-1)
        - [`recording.complete(): Promise<void>`](#recordingcomplete-promisevoid)
      - [ISerializedHttp](#iserializedhttp-1)
  - [Maintenance Status](#maintenance-status)

##### [`FilteredHttpCollection`](#filteredhttpcollection-1)
- [`collection.mocks(): ISerializedHttp[]`](#collectionmocks-iserializedhttp);
- [`collection.ignore(): ISerializedHttp`](#collectionignore-iserializedhttp);
- [`collection.intercepted(): ISerializedHttp[]`](#collectionintercepted-iserializedhttp);
- [`collection.redact(property: string | string[], redactor: Redactor = () => "*****"): void`](#collectionredactproperty-string--string-redactor-redactor-----void);
- [`collection.request(): ISerializedHttp`](#collectionrequest-iserializedhttp);
- [`collection.respond(): ISerializedHttp`](#collectionrespond-iserializedhttp);
- [`collection.response(): ISerializedHttp`](#collectionresponse-iserializedhttp);

##### [`Recording`](#Recording)
- [`recording.complete(): Promise<void>`](#recordingcomplete---promisevoid)

##### [`ISerializedHttp`](#link)

### `YesNo`

The `yesno` instance implements all the methods of the `FilteredHttpCollection` interface.

##### `yesno.spy(options?: IInterceptOptions): void`

Enables intercept of requests if not already enabled.

##### `IInterceptOptions`

`options.ignorePorts: number[]`: _Important._ Since YesNo uses Mitm internally, by default it will intercept any sockets, HTTP or otherwise. If you need to ignore a port (eg for a database connection), provide that port number here. Normally you will run YesNo after long running connections have been established, so this won't be a problem.

##### `yesno.mock(mocks: ISerializedHttp[] | ISerializedHttpMock[], options?: IInterceptOptions): void`

Enables intercept of requests if not already enabled and configures YesNo to respond to all forthcoming intercepted requests with the provided `mocks`.

YesNo responds to the Nth intercepted request with the Nth mock. If the HTTP method & URL of the intercepted request does not match the corresponding mock then the client request will fail.

When YesNo cannot provide a mock for an intercept it emits an `error` event on the corresponding [`ClientRequest`](https://nodejs.org/api/http.html#http_class_http_clientrequest) instance. Most libraries will handle this by throwing an error.

See also [`IInterceptOptions`](#IInterceptOptions).

##### `yesno.recording(options?: IInterceptOptions & IFileOptions): Promise<Recording>`

Begin a new recording. Recording allow you to alternatively spy, record or mock behavior according to the value of the environment variable `YESNO_RECORDING_MODE`. The values and the accompanying behaviors of theses modes are described below.

| Mode   | Value            | Description                                                                                                                 |
| ------ | ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Spy    | "spy"            | Intercept requests & proxy to destination. Don't save. Equivalent to `yesno.spy()`                                          |
| Record | "record"         | Intercept requests & proxy to destination. Save to disk on completion. Equivalent to `yesno.spy()` & `yesno.save()`         |
| Mock   | "mock" (default) | Load mocks from disks. Intercept requests & respond with mocks. Don't save. Equivalent to `yesno.mock(await yesno.load())`. |

**Example**

```javascript
// Begin a recording. Load mocks if in "mock" mode, otherwise spy.
const recording = await yesno.recording({
  filename: './get-users.json'
})

// Make our HTTP requests
await myApi.getUsers()

// Run assertions
expect(yesno.matching(/users/).response()).to.have.property('statusCode', 200)

// Persist intercepted requests if in "record" mode, otherwise no-op
await recording.complete()
```

##### `yesno.test(options: IRecordableTest): (name: string, test: () => Promise<any>) => void`

A utility method for creating test definitions instrumented with `yesno.recording()`. It accepts any testing method `it` or `test` which accepts a `name` and `test` function as its arguments, along with a directory and optional prefix to use for recording fixtures.

##### `IRecordableTest`

`options.test: (name: string, test: () => Promise<any>) => any`: A test function, such as `jest.test` or `mocha.it` which accepts a name and test definition. The test may either be synchronous or return a promise.

`options.it: (name: string, test: () => Promise<any>) => any`: Alias for `options.test`

`options.dir: string`: Directory to use for recording

`options.prefix?: string`: _Optional_. Prefix to use for all fixtures. Useful to prevent conflicts with similarly named tests in other files.

**Example**

Given the below test written with `yesno.recording`....

```javascript
it('should get users', async () => {
  const recording = await yesno.recording({ filename: `${__dirname}/mocks/should-get-users-yesno.json` });
  await myApi.getUsers();
  await recording.save()
})
```

...we may write it more concisely with `yesno.test` as

```javascript
const itRecorded = yesno.test({ it, dir: `${__dirname}/mocks` });

itRecorded('should get users', async () => {
  await myApi.getUsers();
});
```

Which removes much of the boilerplate from our test.

##### `yesno.restore(): void`

Restore normal HTTP functionality by disabling Mitm & restoring any defined stubs. Clears references to any stateful properties such as the defined mocks or intercepted requests.

If you're using YesNo in a test suite it's advisable to run this method after every test case.

##### `yesno.save(options: IFileOptions & ISaveOptions): Promise<void>`

Save serialized HTTP requests to disk. Unless records are provided directly, yesno will save the currently intercepted requests.

You may provide a `filename` in the options object _or_ use the name & directory shorthand to generate a filename from a human readable string.

```javascript
const testName = 'should hit the api'
yesno.save(testName, mocksDir) // => "./test/mocks/should-hit-the-api-yesno.json"
```

Unless providing records, this method will throw an error if there are any in flight requests to prevent users from accidentally saving before all requests have completed.

##### `IFileOptions`

`options.filename: string`: Full filename (JSON)

##### `ISaveOptions`

`options.records?: ISerializedHttp[]`: Records to save. Defaults to already intercepted requests.

##### `yesno.load(options: IFileOptions): Promise<ISerializedHttp[]>`

Load serialized HTTP requests from a local JSON file.

See [`IFileOptions`](#ifileoptions).

##### `yesno.matching(filter?: HttpFilter): FilteredHttpCollection`

Apply a filter to subsequently access or manipulate matching mocks or intercepted requests.

We define an `HttpFilter` as: `type HttpFilter = string | RegExp | ISerializedHttpPartialDeepMatch | (serialized: ISerializedHttp) => boolean`;

The `filter` is applied to each serialized request to filter results. If the filter is...

- A string: Perform an _exact_ match on URL (port optional)
- A regular expression: Test against URL (port optional)
- An object (`ISerializedHttpPartialDeepMatch`): Perform a deep partial comparison against the serialized request
- A function: A callback that receives the `ISerializedHttp` object and returns a `boolean` value of `true` to indicate match.
- `undefined`: The entire collection is returned.

Examples:

```javascript
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
yesno.matching().response(); // short-cut to get the response from the one intercepted request
```

### `FilteredHttpCollection`

##### `collection.mocks(): ISerializedHttp[]`

Return the mocks defined within the collection.

##### `collection.ignore(): ISerializedHttp`

Ignore any mocked responses for all matching requests. Matching requests will be proxied to the host.

Any matching requested set in this way take precedence over all defined and loaded mocks.

##### `collection.intercepted(): ISerializedHttp[]`

Return the intercepted requests defined within the collection.

##### `collection.redact(property: string | string[], redactor: Redactor = () => "*****"): void`

`property`: Property or array of properties on serialized requests to redact.
`redactor`: Callback that receives value and property path on matching requests. Return value will be used as redacted value.

Redact properties on intercepted requests within the collection. Nested properties may be indicated using `.`.

**Example**

```javascript
await myApi.getToken(apiKey)

// Replace the auth values with an md5 hash
yesno.matching(/login/).redact(
  ['request.headers.authorization', 'response.body.token'],
  (value, path) => md5(value)
)
await yesno.save({ filename: 'redacted.json' })
```

##### `collection.request(): ISerializedHttp`

Return the request part of the _single_ matching HTTP request.

Throws an error if the collection does not match _one and only one_ request.

**Example**

```javascript
await myApi.getUsers(token);

expect(yesno.matching(/users/).request()).to.have.nested.property('headers.authorization', token)
```

##### `collection.respond(): ISerializedHttp`

Provide a mock response for all matching requests. Optionally provide a callback to dynamically generate a response for each request.

Any matching responses defined in this way take precedence over normally loaded mocks.

##### `collection.response(): ISerializedHttp`

Response corollary to `collection.request()`. Return the response part of the _single_ matching HTTP request.

Throws an error if the collection does not match _one and only one_ request.

#### Recording

##### `recording.complete(): Promise<void>`

Save the request if we're in record mode. Otherwise no-op.

#### ISerializedHttp

```typescript
interface ISerializedHttp {
 readonly __id: string;
 readonly __version: string;
 readonly __timestamp: number;
 readonly __duration: number;
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

## Maintenance Status

**Active:** Formidable is actively working on this project, and we expect to continue for work for the foreseeable future. Bug reports, feature requests and pull requests are welcome. 

[maintenance-image]: https://img.shields.io/badge/maintenance-active-green.svg
