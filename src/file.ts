import { IDebugger } from 'debug';
import { ensureDir, readFile, writeFile } from 'fs-extra';
import * as _ from 'lodash';
import { EOL } from 'os';
import * as path from 'path';

import {
  DEFAULT_PORT_HTTP,
  DEFAULT_PORT_HTTPS,
  HEADER_CONTENT_TYPE,
  MIME_TYPE_JSON,
} from './consts';

import { YesNoError } from './errors';
import { createRecord, IHeaders, ISerializedHttp } from './http-serializer';
const debug: IDebugger = require('debug')('yesno:mocks');

export interface ISaveFile {
  records: ISerializedHttp[];
}

export interface ISaveOptions {
  records?: ISerializedHttp[];
}

export interface IFileOptions {
  filename: string;
}

export interface IPartialMockRequest {
  headers?: IHeaders;
  body?: string | object;
  port?: number;
  path?: string;
  method: string;
  protocol: 'http' | 'https';
  host: string;
}

export interface IPartialMockResponse {
  body?: string | object;
  headers?: IHeaders;
  statusCode: number;
}

export interface IHttpMock {
  readonly request: IPartialMockRequest;
  readonly response: IPartialMockResponse;
}

export async function load({ filename }: IFileOptions): Promise<ISerializedHttp[]> {
  debug('Loading mocks from', filename);

  let data: Buffer;
  try {
    data = await readFile(filename);
  } catch (e) {
    if ((e as any).code === 'ENOENT') {
      throw new YesNoError(
        `${helpMessageMissingMock(filename)}${EOL}${EOL}Original error: ${e.message}`,
      );
    }

    throw e;
  }

  let obj: ISaveFile;
  const dataString: string = data.toString();

  try {
    obj = JSON.parse(dataString);
  } catch (e) {
    throw new YesNoError(`Failed to parse JSON from ${filename}: ${e}`);
  }

  if (!obj.records) {
    throw new YesNoError('Invalid JSON format. Missing top level "records" key.');
  }

  return obj.records;
}

export async function save({
  filename,
  records = [],
}: ISaveOptions & IFileOptions): Promise<string> {
  debug('Saving %d records to %s', records.length, filename);

  await ensureDir(path.dirname(filename));

  const payload: ISaveFile = { records };
  const contents = JSON.stringify(payload, null, 2);
  await writeFile(filename, contents);

  return filename;
}

function helpMessageMissingMock(filename: string): string {
  const { name } = path.parse(filename);
  // tslint:disable-next-line:max-line-length
  return `Mock file for "${name}" does not exist. To generate the missing file now you may run the command:${EOL}${EOL}./node_modules/.bin/yesno generate "${filename}"`;
}

export function hydrateHttpMock(mock: IHttpMock): ISerializedHttp {
  const { request, response } = mock;

  let responseHeaders = response.headers || {};
  const responseBody: string | object = response.body || '';

  if (_.isPlainObject(response.body) && !responseHeaders[HEADER_CONTENT_TYPE]) {
    debug('Adding missing header %s=%s', HEADER_CONTENT_TYPE, MIME_TYPE_JSON);
    responseHeaders = { ...responseHeaders, [HEADER_CONTENT_TYPE]: MIME_TYPE_JSON };
  }

  return createRecord({
    duration: 0,
    request: {
      // supply defaults for headers, path, and port
      body: request.body || '',
      headers: {},
      path: '/',
      port: request.protocol === 'https' ? DEFAULT_PORT_HTTPS : DEFAULT_PORT_HTTP,
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
export function getMockFilename(name: string, dir: string): string {
  return path.join(dir, `${name.replace(/\s+/g, '-').toLowerCase()}-yesno.json`);
}
