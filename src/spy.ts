import * as http from 'http';
import * as https from 'https';
import * as url from 'url';
const debug = require('debug')('yesno:client-request');

const ClientRequest = http.ClientRequest;

export default class YesNoClientRequest extends ClientRequest {
  // tslint:disable-next-line:max-line-length
  constructor(options: string | URL | http.ClientRequestArgs, cb?: (res: http.IncomingMessage) => void) {
    debug('Instantiating');
    // Add our query to the path
    if (typeof options === 'string') {
      const parsed: url.UrlWithStringQuery = url.parse(options);
      options += parsed.search ? '&__yesno=1' : '?__yesno=1';
    } else if (options instanceof URL) {
      options.searchParams.set('__yesno', '1');
    } else if (options) {
      // tslint:disable-next-line:max-line-length
      options.path = options.path || '/';
      options.path = options.path.indexOf('&') === -1 ? '?__yesno=1' : '&__yesno=1';
    }

    super(options, cb);
  }
}
