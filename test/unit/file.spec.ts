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

  const mockErrorMessage: string = 'some-error';
  const mockError: Error = new Error(mockErrorMessage);

  let file: { [key: string]: any };

  let stubEnsureDir: Stub;
  let stubReadFile: Stub;
  let stubWriteFile: Stub;

  beforeEach(() => {
    stubEnsureDir = sandbox.stub();
    stubReadFile = sandbox.stub();
    stubWriteFile = sandbox.stub();

    mock('fs-extra', {
      ensureDir: stubEnsureDir,
      readFile: stubReadFile,
      writeFile: stubWriteFile,
    });
    mockRequire.reRequire('fs-extra');

    file = mockRequire.reRequire('../../src/file');
  });

  describe('load', () => {
    it('reads the file specified and returns the stored serialized http mocks', async () => {
      stubReadFile.resolves(Buffer.from(expectedData, 'utf8'));

      const results = await file.load({ filename: mockFileName });
      expect(results).deep.equals(mockRecords);

      expect(stubReadFile).calledOnce.and.calledWithExactly(mockFileName);
    });

    it('rejects with a typed error if readFile rejects with missing file', async () => {
      const missingFileError: any = new Error('some message');
      missingFileError.code = 'ENOENT';

      stubReadFile.rejects(missingFileError);

      let error: Error | undefined;
      try {
        await file.load({ filename: mockFileName });
      } catch (e) {
        error = e;
      }
      expect(error).instanceOf(YesNoError);

      expect(stubReadFile).calledOnce.and.calledWithExactly(mockFileName);
    });

    it('rejects with any other rejection from readFile', async () => {
      stubReadFile.rejects(mockError);

      let error: Error | undefined;
      try {
        await file.load({ filename: mockFileName });
      } catch (e) {
        error = e;
      }
      expect(error && error.message).equals(mockErrorMessage);

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
      stubReadFile.resolves(
        Buffer.from(JSON.stringify({ data: 'this is missing records' }), 'utf8'),
      );

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
    it('makes the directory and writes the file', async () => {
      stubEnsureDir.resolves();
      stubWriteFile.resolves();

      const results: string = await file.save({ filename: mockFileName, records: mockRecords });
      expect(results).equals(mockFileName);

      expect(stubEnsureDir).calledOnce;
      expect(normalize(stubEnsureDir.args[0][0])).equals(normalize(mockDirectory));

      expect(stubWriteFile).calledOnce.and.calledWithExactly(mockFileName, expectedData);
    });

    it('provides defaults for some parameters', async () => {
      stubEnsureDir.resolves();
      stubWriteFile.resolves();

      const results: string = await file.save({ filename: mockFileName });
      expect(results).equals(mockFileName);

      expect(stubEnsureDir).calledOnce;
      expect(normalize(stubEnsureDir.args[0][0])).equals(normalize(mockDirectory));

      expect(stubWriteFile).calledOnce.and.calledWithExactly(
        mockFileName,
        JSON.stringify({ records: [] }, null, 2),
      );
    });

    it('rejects if making the directory fails', async () => {
      stubEnsureDir.rejects(mockError);

      let error: Error | undefined;
      try {
        await file.save({ filename: mockFileName, records: mockRecords });
      } catch (e) {
        error = e;
      }
      expect(error && error.message).equals(mockErrorMessage);

      expect(stubEnsureDir).calledOnce;
      expect(normalize(stubEnsureDir.args[0][0])).equals(normalize(mockDirectory));

      expect(stubWriteFile).not.called;
    });

    it('rejects if writing the file contents fails', async () => {
      stubEnsureDir.resolves();
      stubWriteFile.rejects(mockError);

      let error: Error | undefined;
      try {
        await file.save({ filename: mockFileName, records: mockRecords });
      } catch (e) {
        error = e;
      }
      expect(error && error.message).equals(mockErrorMessage);

      expect(stubEnsureDir).calledOnce;
      expect(normalize(stubEnsureDir.args[0][0])).equals(normalize(mockDirectory));

      expect(stubWriteFile).calledOnce.and.calledWithExactly(mockFileName, expectedData);
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

    it('computes the mock file name for a mock name', () => {
      const results: string = getMockFilename(mockName, mockDirectory);
      expect(results).equals(normalize(`${mockDirectory}${sep}some-name-with-spaces-yesno.json`));
    });
  });
});
