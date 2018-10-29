import * as yargs from 'yargs';
import * as file from '../src/file';
import { createRecord, ISerializedHttp } from '../src/http-serializer';
const { version }: { version: string } = require('../package.json');

function createMockRequestResponse(): ISerializedHttp {
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
    return file.save({
      filename,
      records: [createMockRequestResponse()],
    });
  },
}).argv;
