import { expect } from 'chai';
import { IDebugger } from 'debug';
import { readFile, writeFile } from 'fs';
import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http';
import * as _ from 'lodash';
import { EOL } from 'os';
import * as path from 'path';
import { HEADER_CONTENT_TYPE, MIME_TYPE_JSON } from './consts';
import { YesNoError } from './errors';
import { createRecord, SerializedRequest, SerializedRequestResponse } from './http-serializer';
const debug: IDebugger = require('debug')('yesno:mocks');

export interface ISaveFile {
  records: SerializedRequestResponse[];
}

interface IPartialMockRequest {
  headers?: OutgoingHttpHeaders;
  body?: string | object;
  port?: number;
  path?: string;
  method: string;
  protocol: 'http' | 'https';
  host: string;
}

interface IPartialMockResponse {
  body?: string | object;
  headers?: IncomingHttpHeaders;
  statusCode: number;
}

export interface IHttpMock {
  readonly request: IPartialMockRequest;
  readonly response: IPartialMockResponse;
}

export function load(name: string, dir: string): Promise<SerializedRequestResponse[]> {
  return loadFile(getMockFilename(name, dir));
}

export function loadFile(filename: string): Promise<SerializedRequestResponse[]> {
  debug('Loading mocks from', filename);

  return new Promise((resolve, reject) => {
    readFile(filename, (e: Error, data: Buffer) => {
      if (e) {
        if ((e as any).code === 'ENOENT') {
          return reject(
            new YesNoError(
              `${helpMessageMissingMock(filename)}${EOL}${EOL}Original error: ${e.message}`,
            ),
          );
        }

        return reject(e);
      }

      resolve((JSON.parse(data.toString()) as ISaveFile).records);
    });
  });
}

export function save(
  name: string,
  dir: string,
  records: SerializedRequestResponse[],
): Promise<string> {
  return saveFile(getMockFilename(name, dir), records);
}

export function saveFile(filename: string, records: SerializedRequestResponse[]): Promise<string> {
  debug('Saving %d records to %s', records.length, filename);

  return new Promise((resolve, reject) => {
    const payload: ISaveFile = { records };
    const contents = JSON.stringify(payload, null, 2);

    writeFile(filename, contents, (e: Error) => (e ? reject(e) : resolve(filename)));
  });
}

function helpMessageMissingMock(filename: string): string {
  const { name } = path.parse(filename);
  // tslint:disable-next-line:max-line-length
  return `Mock file for "${name}" does not exist. To generate the missing file now you may run the command:${EOL}${EOL}./node_modules/.bin/yesno generate "${filename}"`;
}

export function hydrateHttpMock(mock: IHttpMock): SerializedRequestResponse {
  const { request, response } = mock;

  const responseHeaders = response.headers || {};
  let responseBody = response.body || '';

  if (_.isPlainObject(responseBody)) {
    // If response body is object, handle as JSON
    responseBody = JSON.stringify(response.body);
    responseHeaders[HEADER_CONTENT_TYPE] = MIME_TYPE_JSON;
  }

  return createRecord({
    duration: 0,
    request: {
      headers: {},
      path: '/',
      port: request.protocol === 'https' ? 443 : 80,
      ...request,
    },
    response: {
      body: responseBody,
      headers: responseHeaders,
      statusCode: response.statusCode,
    },
  });
}

/**
 * Get the generated filename for a mock name.
 */
function getMockFilename(name: string, dir: string): string {
  return path.join(dir, `${name}-yesno.json`);
}
