import { expect } from 'chai';
import mock, * as mockRequire from 'mock-require';
import { SinonSandbox as Sandbox, SinonStub as Stub } from 'sinon';
import * as sinon from 'sinon';

import { normalize, sep } from 'path';

import { cloneDeep } from 'lodash';

import {
  getMockFilename,
  hydrateHttpMock,
  IHttpMock,
  IPartialMockRequest,
  IPartialMockResponse,
} from '../../src/file';

import {
  ICreateRecord,
  IHeaders,
  ISerializedHttp,
  ISerializedRequest,
  ISerializedResponse,
} from '../../src/http-serializer';

import * as httpSerializer from '../../src/http-serializer';

import {
  DEFAULT_PORT_HTTP,
  DEFAULT_PORT_HTTPS,
  HEADER_CONTENT_TYPE,
  MIME_TYPE_JSON,
} from '../../src/consts';

import { YesNoError } from '../../src/errors';

describe('file', () => {
  const sandbox: Sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
    mockRequire.stopAll();
  });

  const mockDirectory: string = '/some/directory';
  const mockFileName: string = `${mockDirectory}/some-file-name.json`;
  const mockRecords: ISerializedHttp[] = [];

  const expectedData = JSON.stringify({ records: mockRecords }, null, 2);

  let file: { [key: string]: any };

  let stubMkDirP: Stub;
  let stubReadFile: Stub;
  let stubWriteFile: Stub;

  beforeEach(() => {
    stubMkDirP = sandbox.stub();
    stubReadFile = sandbox.stub();
    stubWriteFile = sandbox.stub();

    mock('mkdirp', stubMkDirP);
    mockRequire.reRequire('mkdirp');

    mock('fs-extra', { readFile: stubReadFile, writeFile: stubWriteFile });
    mockRequire.reRequire('fs-extra');

    file = mockRequire.reRequire('../../src/file');
  });

  describe('load', () => {
    it('reads the file specified and returns the stored serialized http mocks', async () => {
      stubReadFile.resolves(Buffer.from(expectedData, 'utf8'));

      const results: ISerializedHttp[] = await file.load({ filename: mockFileName });
      expect(results).deep.equals(mockRecords);

      expect(stubReadFile).calledOnce.and.calledWithExactly(mockFileName);
    });

    it('rejects if the data is not JSON', async () => {
      stubReadFile.resolves(Buffer.from('this is not JSON', 'utf8'));

      let error: Error | undefined;
      try {
        await file.load({ filename: mockFileName });
      } catch (e) {
        error = e;
      }
      expect(error).instanceOf(YesNoError);

      expect(stubReadFile).calledOnce.and.calledWithExactly(mockFileName);
    });

    it('rejects if the data does not contain top level records property', async () => {
      stubReadFile.resolves(Buffer.from(JSON.stringify({ data: 'this is missing records' }), 'utf8'));

      let error: Error | undefined;
      try {
        await file.load({ filename: mockFileName });
      } catch (e) {
        error = e;
      }
      expect(error).instanceOf(YesNoError);

      expect(stubReadFile).calledOnce.and.calledWithExactly(mockFileName);
    });
  });

  describe('save', () => {
    const mockErrorMessage: string = 'some-error';
    const mockError: Error = new Error(mockErrorMessage);

    it('makes the directory and writes the file', async () => {
      stubMkDirP.callsFake((path: string, callback: (error?: Error) => {}) => {
        expect(normalize(path)).equals(normalize(mockDirectory));
        process.nextTick(callback);
      });

      stubWriteFile.callsFake((path: string, data: string, callback: (error?: Error) => {}) => {
        expect(path).equals(mockFileName);
        expect(data).equals(expectedData);
        process.nextTick(callback);
      });

      const results: string = await file.save({ filename: mockFileName, records: mockRecords });
      expect(results).equals(mockFileName);

      expect(stubMkDirP).calledOnce.and.calledWithMatch(sinon.match.string, sinon.match.func);
      expect(stubWriteFile).calledOnce.and.calledWithMatch(
        sinon.match.string,
        expectedData,
        sinon.match.func,
      );
    });

    it('rejects if making the directory fails', async () => {
      stubMkDirP.callsFake((path: string, callback: (error?: Error) => {}) => {
        expect(normalize(path)).equals(normalize(mockDirectory));
        process.nextTick(() => callback(mockError));
      });

      let error: Error | undefined;
      try {
        await file.save({ filename: mockFileName, records: mockRecords });
      } catch (e) {
        error = e;
      }
      expect(error && error.message).equals(mockErrorMessage);

      expect(stubMkDirP).calledOnce.and.calledWithMatch(sinon.match.string, sinon.match.func);
      expect(stubWriteFile).not.called;
    });

    it('rejects if writing the file contents fails', async () => {
      stubMkDirP.callsFake((path: string, callback: (error?: Error) => {}) => {
        expect(normalize(path)).equals(normalize(mockDirectory));
        process.nextTick(callback);
      });

      stubWriteFile.callsFake((path: string, data: string, callback: (error?: Error) => {}) => {
        expect(path).equals(mockFileName);
        expect(data).equals(expectedData);
        process.nextTick(() => callback(mockError));
      });

      let error: Error | undefined;
      try {
        await file.save({ filename: mockFileName, records: mockRecords });
      } catch (e) {
        error = e;
      }
      expect(error && error.message).equals(mockErrorMessage);

      expect(stubMkDirP).calledOnce.and.calledWithMatch(sinon.match.string, sinon.match.func);
      expect(stubWriteFile).calledOnce.and.calledWithMatch(
        sinon.match.string,
        expectedData,
        sinon.match.func,
      );
    });
  });

  describe('hydrateHttpMock', () => {
    const mockBody: string = 'some-body';

    const mockHeaderName: string = 'some-header-name';
    const mockHeader: string = 'some-header';
    const mockHeaders: IHeaders = {
      [mockHeaderName]: mockHeader,
    };

    const mockHost: string = 'some-host';
    const mockMethod: string = 'GET';
    const mockPath: string = 'some/api/path';
    const mockPort: number = 8080;

    const mockRequest: IPartialMockRequest = {
      body: mockBody,
      headers: mockHeaders,
      host: mockHost,
      method: mockMethod,
      path: mockPath,
      port: mockPort,
      protocol: 'https',
    };

    const mockStatusCode: number = 200;

    const mockResponse: IPartialMockResponse = {
      body: mockBody,
      headers: mockHeaders,
      statusCode: mockStatusCode,
    };

    const mockMock: IHttpMock = {
      request: mockRequest,
      response: mockResponse,
    };

    const mockId: string = 'some-id';
    const mockVersion: string = 'some-version';
    const mockSerializedHttp: ISerializedHttp = {
      __id: mockId,
      __version: mockVersion,
      request: mockRequest as ISerializedRequest,
      response: mockResponse as ISerializedResponse,
    };

    const expectedOptions: ICreateRecord = {
      duration: 0,
      request: {
        headers: {},
        path: '/',
        port: DEFAULT_PORT_HTTPS,
        ...mockRequest,
      },
      response: {
        body: mockBody,
        headers: mockHeaders,
        statusCode: mockStatusCode,
      },
    };

    let stubCreateRecord: Stub;
    beforeEach(() => {
      stubCreateRecord = sandbox.stub(httpSerializer, 'createRecord').returns(mockSerializedHttp);
    });

    it('returns a serialized http record', () => {
      const serializedHttp: ISerializedHttp = hydrateHttpMock(mockMock);
      expect(serializedHttp).deep.equals(mockSerializedHttp);

      expect(stubCreateRecord).calledOnce.and.calledWithExactly(expectedOptions);
    });

    it('provides defaults for response headers and body', () => {
      const clonedMock: IHttpMock = cloneDeep(mockMock);

      // by removing headers and body, the default logic will trigger
      clonedMock.response.headers = undefined;
      clonedMock.response.body = undefined;

      const serializedHttp: ISerializedHttp = hydrateHttpMock(clonedMock);
      expect(serializedHttp).deep.equals(mockSerializedHttp);

      const clonedOptions: ICreateRecord = cloneDeep(expectedOptions);
      clonedOptions.response.body = '';
      clonedOptions.response.headers = {};

      expect(stubCreateRecord).calledOnce.and.calledWithExactly(clonedOptions);
    });

    it('supplies a header content type header as needed', () => {
      const clonedMock: IHttpMock = cloneDeep(mockMock);

      // by specifying a body as an object, the headers will be manipulated
      const mockObjectBody = { data: 'some-data' };
      clonedMock.response.body = mockObjectBody;

      const serializedHttp: ISerializedHttp = hydrateHttpMock(clonedMock);
      expect(serializedHttp).deep.equals(mockSerializedHttp);

      const clonedOptions: ICreateRecord = cloneDeep(expectedOptions);
      clonedOptions.response.body = mockObjectBody;
      clonedOptions.response.headers = {
        ...mockHeaders,
        [HEADER_CONTENT_TYPE]: MIME_TYPE_JSON,
      };

      expect(stubCreateRecord).calledOnce.and.calledWithExactly(clonedOptions);
    });

    it('changes ports based on the protocol', () => {
      const clonedMock: IHttpMock = cloneDeep(mockMock);

      // test port switch
      clonedMock.request.protocol = 'http';

      // demonstrate port is supplied a default in the absence of the request port
      delete clonedMock.request.port;

      const serializedHttp: ISerializedHttp = hydrateHttpMock(clonedMock);
      expect(serializedHttp).deep.equals(mockSerializedHttp);

      const clonedOptions: ICreateRecord = cloneDeep(expectedOptions);
      clonedOptions.request.port = DEFAULT_PORT_HTTP;
      clonedOptions.request.protocol = clonedMock.request.protocol;

      expect(stubCreateRecord).calledOnce.and.calledWithExactly(clonedOptions);
    });
  });

  describe('getMockFileName', () => {
    const mockName: string = 'Some Name With   Spaces';
    const mockDirectory: string = ['some', 'path', 'on', 'disk'].join(sep);

    it('computes the mock file name for a mock name', () => {
      const mockFileName: string = getMockFilename(mockName, mockDirectory);
      expect(mockFileName).equals(`${mockDirectory}${sep}some-name-with-spaces-yesno.json`);
    });
  });
});
