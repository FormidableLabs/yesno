import { expect } from 'chai';
import { IDebugger } from 'debug';
import { readFile, writeFile } from 'fs';
import { EOL } from 'os';
import * as path from 'path';
import { YesNoError } from './errors';
import { SerializedRequest, SerializedRequestResponse } from './http-serializer';
const debug: IDebugger = require('debug')('yesno:mocks');

export interface ISaveFile {
  records: SerializedRequestResponse[];
}

export function assertMatches(
  interceptedRequest: SerializedRequest,
  mockRequest: SerializedRequest,
  requestNum: number,
): void {
  try {
    expect(
      interceptedRequest.host,
      `Expected host "${mockRequest.host}" for request #${requestNum}, received "${
        interceptedRequest.host
      }"`,
    ).to.eql(mockRequest.host);
    const { host } = interceptedRequest;

    expect(
      interceptedRequest.method,
      `Expected request #${requestNum} for ${host} to HTTP method "${mockRequest.method}", not "${
        interceptedRequest.method
      }"`,
    ).to.eql(mockRequest.method);

    expect(
      interceptedRequest.protocol,
      `Expected request #${requestNum} for ${host} to use "${
        mockRequest.protocol
      }" protocol, not "${interceptedRequest.protocol}"`,
    ).to.eql(mockRequest.protocol);

    expect(
      interceptedRequest.port,
      `Expected request #${requestNum} for ${host} to be served on port "${
        mockRequest.port
      }", not "${interceptedRequest.port}"`,
    ).to.eql(mockRequest.port);

    const nickname = `${interceptedRequest.method} ${interceptedRequest.protocol}://${
      interceptedRequest.host
    }:${interceptedRequest.port}`;

    expect(
      interceptedRequest.path,
      `Expected request #${requestNum} "${nickname}" to have path "${mockRequest.path}", not "${
        interceptedRequest.path
      }"`,
    ).to.eql(mockRequest.path);
  } catch (e) {
    const error = new YesNoError(`Request does not match mock. ${e.message}`);
    throw error;
  }
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

/**
 * Get the generated filename for a mock name.
 */
function getMockFilename(name: string, dir: string): string {
  return path.join(dir, `${name}-yesno.json`);
}
