"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const sinon = __importStar(require("sinon"));
/* Import can break our reference to the module object, so require instead */
const http = require('http');
const https = require('https');
const sandbox = sinon.createSandbox();
let clientRequestStub;
class YesNoClientRequest extends http_1.ClientRequest {
    constructor(url, cb) {
        console.log('URL!', url);
        super(url, cb);
    }
}
function install() {
    // https://github.com/nodejs/node/blob/master/lib/http.js#L40
    // clientRequestStub = sinon.stub(http, 'ClientRequest').value(1);
    http.ClientRequest.prototype = YesNoClientRequest;
    const httpsRequest = https.request;
    const httpsGet = https.get;
    const httpRequest = http.request;
    const httpGet = http.get;
    http.request = (options, cb) => new YesNoClientRequest(options, cb);
    // https.get = (...args: any[]) =>
    //   console.log('Stub called2') || httpsGet(...args);
    // http.request = (...args: any[]) =>
    //   console.log('Stub called3') || httpRequest(...args);
    // http.get = (...args: any[]) =>
    //   console.log('Stub called4') || httpGet(...args);
}
exports.install = install;
//# sourceMappingURL=index.js.map