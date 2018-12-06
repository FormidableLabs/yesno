import { IDebugger } from 'debug';
import { IFileOptions, save } from './file';
import { ISerializedHttp } from './http-serializer';
const debug: IDebugger = require('debug')('yesno:recording');

export enum RecordMode {
  /**
   * Intercept requests and respond with local mocks
   */
  Mock = 'mock',
  /**
   * Spy on request/response
   */
  Spy = 'spy',
  /**
   * Save requests
   */
  Record = 'record',
}

export interface IRecordingOptions extends IFileOptions {
  getRecordsToSave: () => ISerializedHttp[];
  mode: RecordMode;
}

export default class Recording {
  private options: IRecordingOptions;

  constructor(options: IRecordingOptions) {
    this.options = options;
  }

  public complete(): Promise<string | undefined> {
    if (this.options.mode === RecordMode.Record) {
      debug('Record mode, saving');
      return save({
        ...this.options,
        records: this.options.getRecordsToSave(),
      });
    }

    debug('"%s" mode, no-op', this.options.mode);
    return Promise.resolve(undefined);
  }
}
