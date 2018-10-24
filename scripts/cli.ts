import * as yargs from 'yargs';
import { createRecord, SerializedRequestResponse } from '../src/http-serializer';
import * as mocks from '../src/mocks';
const { version }: { version: string } = require('../package.json');

function createMockRequestResponse(): SerializedRequestResponse {
  return createRecord({
    duration: 0,
    request: {
      body: '{}',
      headers: {},
      host: 'example.com',
      method: 'POST',
      path: '/',
      port: 443,
      protocol: 'https',
    },
    response: {
      body: '',
      headers: {
        'x-yesno': 'generated mock',
      },
      statusCode: 501,
    },
  });
}

// tslint:disable-next-line:no-unused-expression
yargs.command({
  command: 'generate <filename>',
  handler: (argv) => {
    const { filename } = argv;
    return mocks.saveFile(filename, [createMockRequestResponse()]);
  },
}).argv;
