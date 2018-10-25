# YesNo

YesNo is an HTTP testing library that uses [Mitm](https://github.com/moll/node-mitm) to intercept outgoing HTTP requests, allowing you to easily write assertions against requests or use them to generate mocks.

## Installing

```
npm i --save-dev yesno
```

## Usage

### Spy on requests

```javascript
const { yesno } = require('yesno');
const { expect } = require('chai');
const fbApi = require('./fb-api');

describe('api', () => {
  it('should get users', async () => {
    yesno.enable().spy();
    const users = await fbApi.getUsers();
    const intercepted = yesno.intercepted();

    expect(intercepted).have.lengthOf(1);
    expect(intercepted[0]).have.nested.property('url', 'https://api.facebook.com/users');
    expect(users).to.eql(intercepted[0].response.body.users);
  });
});
```

### Generate mocks from intercepted requests

```javascript
const { yesno } = require('yesno');
const { expect } = require('chai');
const fbApi = require('./fb-api');

describe('api', () => {
  it('should get users', async () => {
    yesno.enable({ dir: `${__dirname}/mocks` }).spy();
    await fbApi.getUsers();

    yesno.save('api-get-users');
  });
});
```

Sometimes we need to remove sensitive information from the requests before saving the records to disk. We can use `matching` in conjunction with `redact` to remove these properties from our intercepted requests.

```javascript
yesno.enable({ dir: `${__dirname}/mocks` }).spy();
apiKey = await fbApi.authenticate();
await fbApi.getUsers(apiKey);

yesno.matching(/facebook.com\/auth/).redact('response.body.token');
yesno.matching(/facebook.com\/users/).redact('request.headers.auth');

await yesno.save('api-get-users');
```

### Load mocks from disk

```javascript
const { yesno } = require('yesno');
const { expect } = require('chai');
const fbApi = require('./fb-api');

describe('api', () => {
  it('should get users', async () => {
    yesno.enable({ dir: `${__dirname}/mocks` }).mock();
    const mocks = await yesno.load('api-get-users');

    const users = await fbApi.getUsers();

    expect(users).to.eql(mocks[0].response.body.users);
  });
});
```

### Define mocks in code

```javascript
const { yesno } = require('yesno');
const { expect } = require('chai');
const fbApi = require('./fb-api');

describe('api', () => {
  it('should get users', async () => {
    const mocks = [{
      request: {
        method: 'POST',
        path: '/users',
        host: 'facebook.com',
        protocol: 'https'
      },
      response: {
        body: {
          users: 'foobar'
        },
        statusCode: 200
      }
    }];
    yesno.enable({ dir: `${__dirname}/mocks` }).mock();

    const users = await fbApi.getUsers();

    expect(users).to.eql(mocks[0].response.body.users);
  });
});
```

## API

#### YesNo

- [`yesno.enable(options: IYesNoOptions): void`](link);
- [`yesno.disable(): void`](link);
- [`yesno.clear(): void`](link);
- [`yesno.spy(): void`](link);
- [`yesno.mock(mocks?: IHttpMock[]): void`](link);
- [`yesno.load(name: string, dir: string): Promise<IHttpMock[]>`](link);
- [`yesno.save(name: string, dir: string): Promise<void>`](link);
- [`yesno.matching(query: string | RegExp | IMatch): QueryableRequestsCollection`](link);

#### QueryableRequestsCollection

- [`collection.mocks(): void`](link);
- [`collection.intercepted(): void`](link);
- [`collection.redact(): void`](link);
- [`collection.doesMatchMock(): void`](link);
