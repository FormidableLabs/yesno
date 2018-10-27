import {
  ClientRequest,
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeaders,
  RequestOptions,
} from 'http';
import * as _ from 'lodash';
import { Transform } from 'stream';
import uuid = require('uuid');
import { HEADER_CONTENT_TYPE, MIME_TYPE_JSON, YESNO_INTERNAL_HTTP_HEADER } from './consts';
const debug = require('debug')('yesno:http-serializer');
const SCHEMA_VERSION = '1.0.0';
/* tslint:disable:max-classes-per-file */

export interface SerializedRequestResponse {
  readonly __id: string;
  readonly __version: string;
  readonly __timestamp?: number;
  readonly __duration?: number;
  readonly request: SerializedRequest;
  readonly response: SerializedResponse;
}

export interface SerializedResponse {
  /**
   * JSON bodies will be parsed to objects
   */
  readonly body: string | object;
  readonly headers: IncomingHttpHeaders;
  readonly statusCode: number;
}

export interface SerializedRequest {
  /**
   * JSON bodies will be parsed to objects
   */
  readonly body?: string | object;
  readonly headers: OutgoingHttpHeaders;
  readonly host: string;
  readonly path: string;
  readonly method: string;
  readonly port: number;
  readonly query?: string;
  readonly protocol: 'http' | 'https';
}

// Some properties are not present in the TS definition
export interface ClientRequestFull extends ClientRequest {
  agent?: {
    defaultPort?: number;
  };
  path: string;
}

function serializeJSON(
  headers: OutgoingHttpHeaders | IncomingHttpHeaders,
  body?: string,
): undefined | string | object {
  const isJSON = headers[HEADER_CONTENT_TYPE] === MIME_TYPE_JSON;

  if (isJSON) {
    try {
      body = JSON.parse(body as string);
    } catch (e) {
      // Don't throw, just log and continue with unparsed body
      debug('Failed to parse JSON body', body);
    }
  }

  return body;
}

export class RequestSerializer extends Transform implements SerializedRequest {
  public body: string | undefined;
  public headers: OutgoingHttpHeaders = {};
  public host: string;
  public path: string;
  public method: string;
  public port: number;
  public protocol: 'http' | 'https';
  /**
   * Query part _including_ `?`
   */
  public query?: string;

  constructor(
    originalClientOpts: RequestOptions,
    originalClientReq: ClientRequest,
    interceptedServerReq: IncomingMessage,
    isHttps: boolean,
  ) {
    super();

    // @see https://github.com/nodejs/node/blob/v10.11.0/lib/_http_client.js#L121
    const agent = (originalClientReq as ClientRequestFull).agent;
    const defaultPort = originalClientOpts.defaultPort || (agent && agent.defaultPort);
    const port: number | string = originalClientOpts.port || defaultPort || 80;
    this.port = typeof port === 'string' ? parseInt(port, 10) : port;

    // @see https://github.com/nodejs/node/blob/v10.11.0/lib/_http_client.js#L125
    const [path, query] = (originalClientReq as ClientRequestFull).path.split('?');
    this.host = originalClientOpts.hostname || originalClientOpts.host || 'localhost';
    this.method = (interceptedServerReq.method as string).toUpperCase();
    this.path = path;
    this.query = query ? `?${query}` : query;
    this.protocol = isHttps ? 'https' : 'http';
    this.headers = _.omit(originalClientReq.getHeaders(), YESNO_INTERNAL_HTTP_HEADER);
  }

  public _transform(chunk: Buffer, encoding: string, done: () => void) {
    this.body = this.body || '';
    this.body += chunk.toString(); // @todo Do we really need to convert to string for each chunk?

    this.push(chunk);
    done();
  }

  public serialize(): SerializedRequest {
    return {
      body: serializeJSON(this.headers, this.body),
      headers: this.headers,
      host: this.host,
      method: this.method,
      path: this.path,
      port: this.port,
      protocol: this.protocol,
      query: this.query,
    };
  }
}

export class ResponseSerializer extends Transform implements SerializedResponse {
  public body: string | object;
  public headers: IncomingHttpHeaders = {};
  public statusCode: number;

  constructor(clientResponse: IncomingMessage) {
    super();

    this.body = '';
    this.statusCode = clientResponse.statusCode as number;
    this.headers = clientResponse.headers;
  }

  public _transform(chunk: Buffer, encoding: string, done: () => void) {
    this.body += chunk.toString();

    this.push(chunk);
    done();
  }

  public serialize(): SerializedResponse {
    return {
      body: serializeJSON(this.headers, this.body as string) as string | object,
      headers: this.headers,
      statusCode: this.statusCode,
    };
  }
}

export function formatUrl(request: SerializedRequest, includePort: boolean = false): string {
  const port = includePort ? `:${request.port}` : '';
  const query = request.query || '';
  return `${request.protocol}://${request.host}${port}${request.path}${query}`;
}

export function createRecord({
  request,
  response,
  duration,
}: {
  request: SerializedRequest;
  response: SerializedResponse;
  duration: number;
}): SerializedRequestResponse {
  return {
    __duration: duration,
    __id: uuid.v4(),
    __timestamp: Date.now(),
    __version: SCHEMA_VERSION,
    request,
    response,
  };
}
