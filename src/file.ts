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

import { IResponseForMatchingRequest } from './context';
import { YesNoError } from './errors';
import { HttpFilter, ISerializedHttpPartialDeepMatch } from './filtering/matcher';
import { createRecord, IHeaders, ISerializedHttp } from './http-serializer';
const debug: IDebugger = require('debug')('yesno:mocks');

export interface ISaveFile {
  filter?: HttpFilter;
  ignoreMatchingRequests?: IResponseForMatchingRequest[];
  records: ISerializedHttp[];
}

export interface ISaveOptions {
  filter?: HttpFilter;
  force?: boolean;
  ignoreMatchingRequests?: IResponseForMatchingRequest[];
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

function regexToString(rgx: string | RegExp) {
  if (typeof rgx !== 'string') {
    return '_RgX:' + rgx.toString();
  }
  return rgx;
}

function toRegex(str: string) {
  if (str.substr(0, 5) === '_RgX:') {
    const idx = str.lastIndexOf('/');
    const exp = str.substring(6, idx); // remove beginning and trailing slashes
    const flags = str.substr(idx + 1);
    return new RegExp(exp, flags);
  }
  return str;
}

/**
 * Read mocks from a specified file.
 *
 * @throws YesNoError If file is improperly formatted
 */
export async function load({ filename }: IFileOptions): Promise<ISaveFile> {
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

  let obj;
  let ret: ISaveFile;
  const dataString: string = data.toString();

  try {
    obj = JSON.parse(dataString);
  } catch (e) {
    throw new YesNoError(`Failed to parse JSON from ${filename}: ${e}`);
  }

  if (!obj.records) {
    throw new YesNoError('Invalid JSON format. Missing top level "records" key.');
  }

  // restore regexp values
  if (obj.filter && obj.filter.url && typeof obj.filter.url === 'string') {
    obj.filter.url = toRegex(obj.filter.url);
  }

  if (obj.ignoreMatchingRequests && obj.ignoreMatchingRequests.length) {
    obj.ignoreMatchingRequests.map((o: IResponseForMatchingRequest) => {
      if (typeof o.matcher !== 'function' && typeof o.matcher.url === 'string') {
        o.matcher.url = toRegex(o.matcher.url);
      }
    });
  }
  ret = obj;

  return ret;
}

/**
 * Save HTTP records to the specified file
 */
export async function save({
  filter,
  filename,
  ignoreMatchingRequests,
  records = [],
}: ISaveOptions & IFileOptions): Promise<string> {
  debug('Saving %d records to %s', records.length, filename);

  await ensureDir(path.dirname(filename));

  // convert RegExp values to strings for saving
  if (filter && typeof filter === 'object') {
    if (filter instanceof RegExp) {
      filter = regexToString(filter);
    } else if (filter.url) {
      filter.url = regexToString(filter.url);
    }
  }
  if (ignoreMatchingRequests && ignoreMatchingRequests.length) {
    ignoreMatchingRequests.map((o) => {
      if (typeof o.matcher !== 'function' && o.matcher.url && typeof o.matcher.url !== 'string') {
        o.matcher.url = regexToString(o.matcher.url);
      }
    });
  }
  else {
    ignoreMatchingRequests = undefined;
  }

  const payload: ISaveFile = { filter, ignoreMatchingRequests, records };
  const contents = JSON.stringify(payload, null, 2);
  await writeFile(filename, contents);

  return filename;
}

function helpMessageMissingMock(filename: string): string {
  const { name } = path.parse(filename);
  // tslint:disable-next-line:max-line-length
  return `Mock file for "${name}" does not exist. If you are using itRecorded, you can run the test in record mode by setting the YESNO_RECORDING_MODE environment variable to "record".${EOL}${EOL}YESNO_RECORDING_MODE=record <test command>${EOL}${EOL}Or to generate the missing file now you may run the command:${EOL}${EOL}./node_modules/.bin/yesno generate "${filename}"`;
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
