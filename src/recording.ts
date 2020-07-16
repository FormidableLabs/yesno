import { IDebugger } from 'debug';
import { IResponseForMatchingRequest } from './context';
import { IFileOptions, save } from './file';
import { HttpFilter } from './filtering/matcher';
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
  /**
   * Get all recorded HTTP requests we need to save to disc
   */
  getRecordsToSave: () => ISerializedHttp[];
  /**
   * Current record mode. Determines whether or not we'll save to disc on completion.
   */
  mode: RecordMode;
}

/**
 * Represents a single YesNo recording
 */
export default class Recording {
  private options: IRecordingOptions;

  constructor(options: IRecordingOptions) {
    this.options = options;
  }

  /**
   * Complete recording by saving all HTTP requests to disc if in record mode.
   * No-op otherwise.
   */
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
