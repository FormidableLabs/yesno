import * as http from 'http';
import * as https from 'https';
import { omit } from 'lodash';
import * as url from 'url';
const debug = require('debug')('yesno:proxy');

interface ProxiedRequestOptions extends http.RequestOptions {
  proxying?: boolean;
  uri?: url.UrlWithStringQuery;
}

/**
 * Proxy the intercepted request
 */
export function createProxiedRequest(
  interceptedRequest: http.IncomingMessage,
): http.ClientRequest {
  const isHttps: boolean = (interceptedRequest.connection as any).encrypted;
  const request = isHttps ? https.request : http.request;
  const options: ProxiedRequestOptions = {
    // @todo Do we really need to remove content-length?
    headers: omit(interceptedRequest.headers, 'content-length'),
    host: interceptedRequest.headers.host,
    method: interceptedRequest.method,
    path: url.parse(interceptedRequest.url as string).path,
    proxying: true,
  };

  debug(
    'Creating %s proxy to %s:',
    isHttps ? 'https' : 'http',
    options.host,
    options,
  );

  return request(options);
}
