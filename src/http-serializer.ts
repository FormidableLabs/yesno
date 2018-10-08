
import {
  ClientRequest,
  IncomingHttpHeaders,
  IncomingMessage,
  OutgoingHttpHeaders,
  RequestOptions,
} from 'http';
import * as _ from 'lodash';
import { Transform } from 'stream';
import { YESNO_INTERNAL_HTTP_HEADER } from './consts';
const debug = require('debug')('yesno:http-serializer');
/* tslint:disable:max-classes-per-file */

export interface SerializedRequestResponse {
  request: SerializedRequest;
  response: SerializedResponse;
}

export interface SerializedResponse {
  body?: string;
  headers: IncomingHttpHeaders;
  statusCode: number;
}

export interface SerializedRequest {
  body?: string;
  headers: OutgoingHttpHeaders;
  host: string;
  path: string;
  method: string;
  port: number;
  protocol: 'http' | 'https';
}

// Some properties are not present in the TS definition
export interface ClientRequestFull extends ClientRequest {
  agent?: {
    defaultPort?: number;
  };
  path: string;
}

export class RequestSerializer extends Transform implements SerializedRequest {
  public body: string | undefined;
  public headers: OutgoingHttpHeaders = {};
  public host: string;
  public path: string;
  public method: string;
  public port: number;
  public protocol: 'http' | 'https';
  private data: Buffer[] = [];

  constructor(
    originalClientOpts: RequestOptions,
    originalClientReq: ClientRequest,
    interceptedServerReq: IncomingMessage,
    isHttps: boolean,
    ) {
    super();

    // @see https://github.com/nodejs/node/blob/v10.11.0/lib/_http_client.js#L121
    const agent = (originalClientReq as ClientRequestFull).agent;
    const defaultPort = originalClientOpts.defaultPort || agent && agent.defaultPort;
    const port: number | string = originalClientOpts.port || defaultPort || 80;
    this.port = typeof port === 'string' ? parseInt(port, 10) : port;

    // @see https://github.com/nodejs/node/blob/v10.11.0/lib/_http_client.js#L125
    this.host = originalClientOpts.hostname || originalClientOpts.host || 'localhost';
    this.method = interceptedServerReq.method as string;
    this.path = (originalClientReq as ClientRequestFull).path; // We force set this property earlier
    this.protocol = isHttps ? 'https' : 'http';
    this.headers = _.omit(originalClientReq.getHeaders(), YESNO_INTERNAL_HTTP_HEADER);
  }

  public _transform(chunk: Buffer, encoding: string, done: () => void) {
    this.body = this.body || '';
    this.body += chunk.toString();

    this.push(chunk);
    done();
  }

  public serialize(): SerializedRequest {
    return {
      body: this.body,
      headers: this.headers,
      host: this.host,
      method: this.method,
      path: this.path,
      port: this.port,
      protocol: this.protocol,
    };
  }
}

export class ResponseSerializer extends Transform implements SerializedResponse {
  public body?: string;
  public headers: IncomingHttpHeaders = {};
  public statusCode: number;
  private data: Buffer[] = [];

  constructor(
    clientResponse: IncomingMessage,
    ) {
    super();

    this.statusCode = clientResponse.statusCode as number;
    this.headers = clientResponse.headers;
  }

  public _transform(chunk: Buffer, encoding: string, done: () => void) {
    this.body = this.body || '';
    this.body += chunk.toString();

    this.push(chunk);
    done();
  }

  public serialize(): SerializedResponse {
    return {
      body: this.body,
      headers: this.headers,
      statusCode: this.statusCode,
    };
  }
}
