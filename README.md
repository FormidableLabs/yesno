[![Build Status](https://travis-ci.com/FormidableLabs/yesno.svg?branch=master)](https://travis-ci.com/FormidableLabs/yesno)

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
const recording = await yesno.record({ filename: './get-users-yesno.json' });
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

Visit the [examples](https://github.com/FormidableLabs/yesno/tree/master/examples) directory to see sample tests written with YesNo.

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

See complete documentation [here](./docs).
