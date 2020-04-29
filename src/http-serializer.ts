import { ClientRequest, IncomingMessage, RequestOptions } from 'http';
import * as t from 'io-ts';
import { reporter } from 'io-ts-reporters';
import * as _ from 'lodash';
import { Transform } from 'stream';
import uuid = require('uuid');
import { HEADER_CONTENT_TYPE, MIME_TYPE_JSON, YESNO_INTERNAL_HTTP_HEADER } from './consts';
import { YesNoError } from './errors';
const debug = require('debug')('yesno:http-serializer');
const SCHEMA_VERSION = '1.0.0';
/* tslint:disable:max-classes-per-file */

// @see http.OutgoingHttpHeaders
const Headers = t.dictionary(
  t.string,
  t.union([t.number, t.string, t.array(t.string), t.undefined]),
);

const SerializedRequestOptional = t.partial({
  body: t.readonly(t.union([t.string, t.object])), // Optional
  query: t.readonly(t.string), // Optional
});

const SerializedRequest = t.intersection([
  t.interface({
    headers: t.readonly(Headers),
    host: t.readonly(t.string),
    method: t.readonly(t.string),
    path: t.readonly(t.string),
    port: t.readonly(t.Integer),
    protocol: t.readonly(t.union([t.literal('http'), t.literal('https')])),
  }),
  SerializedRequestOptional,
]);

const SerializedResponse = t.interface({
  body: t.readonly(t.union([t.string, t.object])),
  headers: t.readonly(Headers),
  statusCode: t.readonly(t.Integer),
});

const SerializedHttpOptional = t.partial({
  __duration: t.readonly(t.number), // Optional
  __timestamp: t.readonly(t.number), // Optional
});

const SerializedHttp = t.intersection([
  SerializedHttpOptional,
  t.interface({
    __id: t.readonly(t.string),
    __version: t.readonly(t.string),
    request: SerializedRequest,
    response: SerializedResponse,
  }),
]);

/**
 * HTTP request/response serialized in a consistent format
 */
export interface ISerializedHttp extends t.TypeOf<typeof SerializedHttp> {}

/**
 * HTTP request serialized in a consistent format
 */
export interface ISerializedResponse extends t.TypeOf<typeof SerializedResponse> {}

/**
 * HTTP response serialized in a consistent format
 */
export interface ISerializedRequest extends t.TypeOf<typeof SerializedRequest> {}

/**
 * HTTP request & response
 */
export interface ISerializedRequestResponse {
  request: ISerializedRequest;
  response: ISerializedResponse;
}

export interface IHeaders extends t.TypeOf<typeof Headers> {}

// Some properties are not present in the TS definition
export interface ClientRequestFull extends ClientRequest {
  agent?: {
    defaultPort?: number;
  };
  path: string;
}

function serializeJSON(headers: IHeaders, body?: string): undefined | string | object {
  const isJSON =
    headers[HEADER_CONTENT_TYPE] &&
    (headers[HEADER_CONTENT_TYPE] as string).includes(MIME_TYPE_JSON);

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

export class RequestSerializer extends Transform implements ISerializedRequest {
  public body: string | undefined;
  public headers: IHeaders = {};
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

  public serialize(): ISerializedRequest {
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

export class ResponseSerializer extends Transform implements ISerializedResponse {
  public body: string | object;
  public headers: IHeaders = {};
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

  public serialize(): ISerializedResponse {
    return {
      body: serializeJSON(this.headers, this.body as string) as string | object,
      headers: this.headers,
      statusCode: this.statusCode,
    };
  }
}

export function formatUrl(request: ISerializedRequest, includePort: boolean = false): string {
  const port = includePort ? `:${request.port}` : '';
  const query = request.query || '';
  return `${request.protocol}://${request.host}${port}${request.path}${query}`;
}

export interface ICreateRecord {
  request: ISerializedRequest;
  response: ISerializedResponse;
  duration: number;
}

/**
 * Create record for an HTTP request, which may be saved in a mock file.
 */
export function createRecord({ request, response, duration }: ICreateRecord): ISerializedHttp {
  return {
    __duration: duration,
    __id: uuid.v4(),
    __timestamp: Date.now(),
    __version: SCHEMA_VERSION,
    request,
    response,
  };
}

export function validateSerializedHttpArray(records: object[]) {
  const result = t.array(SerializedHttp).decode(records);

  if (result.isLeft()) {
    const errs = reporter(result);
    throw new YesNoError(`Invalid serialized HTTP. (Errors: ${errs.join(', ')})`);
  }
}
