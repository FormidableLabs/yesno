import { ClientRequest, ClientRequestArgs } from 'http';
import * as sinon from 'sinon';

/* Import can break our reference to the module object, so require instead */
const http: any = require('http');
const https: any = require('https');

const sandbox: sinon.SinonSandbox = sinon.createSandbox();
let clientRequestStub: sinon.SinonStub;

class YesNoClientRequest extends ClientRequest {
  constructor(
    url: string | URL | ClientRequestArgs,
    cb: () => void | undefined,
  ) {
    console.log('URL!', url);
    super(url, cb);
  }
}

export function install(): void {
  // https://github.com/nodejs/node/blob/master/lib/http.js#L40
  // clientRequestStub = sinon.stub(http, 'ClientRequest').value(1);
  http.ClientRequest.prototype = YesNoClientRequest;
  const httpsRequest: (...a: any[]) => void = https.request;
  const httpsGet: (...a: any[]) => void = https.get;
  const httpRequest: (...a: any[]) => void = http.request;
  const httpGet: (...a: any[]) => void = http.get;

  http.request = (
    options: string | URL | ClientRequestArgs,
    cb: () => void | undefined,
  ) => new YesNoClientRequest(options, cb);
  // https.get = (...args: any[]) =>
  //   console.log('Stub called2') || httpsGet(...args);
  // http.request = (...args: any[]) =>
  //   console.log('Stub called3') || httpRequest(...args);
  // http.get = (...args: any[]) =>
  //   console.log('Stub called4') || httpGet(...args);
}
