import { expect } from 'chai';
import { SinonSandbox as Sandbox, SinonStub as Stub } from 'sinon';
import * as sinon from 'sinon';

import * as file from '../../src/file';
import { ISerializedHttp } from '../../src/http-serializer';
import Recording, { IRecordingOptions, RecordMode } from '../../src/recording';

describe('recording', () => {
  const sandbox: Sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  const mockRecordMode: RecordMode = RecordMode.Record;
  const mockOptions: IRecordingOptions = { mode: mockRecordMode } as IRecordingOptions;

  let stubGetRecordsToSave: Stub;

  let instance: Recording;
  beforeEach(() => {
    stubGetRecordsToSave = sandbox.stub();

    Object.assign(mockOptions, { getRecordsToSave: stubGetRecordsToSave });
    instance = new Recording(mockOptions);
  });

  describe('constructor', () => {
    it('returns a configured instance of Recording', () => {
      expect(instance).instanceOf(Recording);
    });
  });

  describe('complete', () => {
    const mockFileName: string = 'some-file-name';
    const mockRecords: ISerializedHttp[] = [];

    let stubSave: Stub;

    beforeEach(() => {
      stubSave = sandbox.stub(file, 'save');
    });

    it('invokes the file save method if mode is Record', async () => {
      stubGetRecordsToSave.returns(mockRecords);
      stubSave.resolves(mockFileName);

      const results: string | undefined = await instance.complete();
      expect(results).equals(mockFileName);

      expect(stubGetRecordsToSave).calledOnce.and.calledWithExactly();

      expect(stubSave).calledOnce.and.calledWithMatch({
        getRecordsToSave: sinon.match.func,
        mode: mockRecordMode,
        records: mockRecords,
      });
    });

    it('does not invoke the file save method if mode is not Record', async () => {
      const options = { mode: RecordMode.Spy } as IRecordingOptions;
      Object.assign(options, { getRecordsToSave: stubGetRecordsToSave });

      instance = new Recording(options);

      const results: string | undefined = await instance.complete();
      expect(results).undefined;

      expect(stubGetRecordsToSave).not.called;
      expect(stubSave).not.called;
    });
  });
});
