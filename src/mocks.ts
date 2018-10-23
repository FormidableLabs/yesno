import { expect } from 'chai';
import { IDebugger } from 'debug';
import { readFile, writeFile } from 'fs';
import * as path from 'path';
import { YesNoError } from './errors';
import { SerializedRequest, SerializedRequestResponse } from './http-serializer';
const debug: IDebugger = require('debug')('yesno:mocks');

export interface ISaveFile {
  records: SerializedRequestResponse[];
}

export function assertMatches(
  currentRequest: SerializedRequest,
  mockRequest: SerializedRequest,
  requestNum: number,
): void {
  expect(currentRequest.host, `YesNo: Expected different host for request #${requestNum}`).to.eql(
    mockRequest.host,
  );
  const { host } = currentRequest;

  expect(
    currentRequest.method,
    `YesNo: Expected request #${requestNum} for ${host} to use the ${mockRequest.method} method`,
  ).to.eql(mockRequest.method);

  expect(
    currentRequest.protocol,
    `YesNo: Expected request #${requestNum} for ${host} to be served over ${mockRequest.protocol}`,
  ).to.eql(mockRequest.protocol);

  expect(
    currentRequest.port,
    `YesNo: Expected request #${requestNum} for ${host} to be served on port ${mockRequest.port}`,
  ).to.eql(mockRequest.port);

  const nickname = `${currentRequest.method} ${currentRequest.protocol}://${currentRequest.host}:${
    currentRequest.port
  }`;

  // @todo check auth part

  expect(
    currentRequest.path,
    `YesNo: Expected request #${requestNum} "${nickname}" to have path ${mockRequest.path}`,
  ).to.eql(mockRequest.path);
}

export function load(name: string, dir: string): Promise<SerializedRequestResponse[]> {
  const filename = getMockFilename(name, dir);
  debug('Loading mocks from', filename);

  return new Promise((resolve, reject) => {
    readFile(filename, (e: Error, data: Buffer) => {
      if (e) {
        if ((e as any).code === 'ENOENT') {
          return reject(new YesNoError(`Mock file does not exist: ${e.message}`));
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
  return new Promise((resolve, reject) => {
    const payload: ISaveFile = { records };
    const contents = JSON.stringify(payload, null, 2);
    const filename = getMockFilename(name, dir as string);
    debug('Saving %d records to %s', records.length, filename);

    writeFile(filename, contents, (e: Error) => (e ? reject(e) : resolve(filename)));
  });
}

/**
 * Get the generated filename for a mock name.
 */
function getMockFilename(name: string, dir: string): string {
  return path.join(dir, `${name}-yesno.json`);
}
