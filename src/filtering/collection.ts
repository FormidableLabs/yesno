import * as _ from 'lodash';
import { DEFAULT_REDACT_SYMBOL } from '../consts';
import Context from '../context';
import { SerializedRequestResponse } from '../http-serializer';
import { ISerializedHttpPartialDeepMatch, match } from './matcher';
import { redact } from './redact';

export type RedactSymbol = string | ((value: any, path: string) => string);

export interface IFiltered {
  redact: (property: string | string[], symbol: RedactSymbol) => void;
  intercepted: () => SerializedRequestResponse[];
  mocks: () => SerializedRequestResponse[];
}

interface IFilteredHttpCollectionParams {
  context: Context;
  query?: ISerializedHttpPartialDeepMatch;
}

export default class FilteredHttpCollection implements IFiltered {
  private readonly ctx: Context;
  private readonly query: ISerializedHttpPartialDeepMatch;

  constructor({ context, query = {} }: IFilteredHttpCollectionParams) {
    this.ctx = context;
    this.query = query;
  }

  public intercepted(): SerializedRequestResponse[] {
    return this.ctx.interceptedRequestsCompleted.filter(match(this.query));
  }

  public mocks(): SerializedRequestResponse[] {
    return this.ctx.loadedMocks.filter(match(this.query));
  }

  public redact(property: string | string[], redactSymbol?: RedactSymbol): void {
    redactSymbol = redactSymbol || DEFAULT_REDACT_SYMBOL;
    const redactedRecords = redact(this.intercepted(), property, redactSymbol);

    const newCompleted = [...this.ctx.interceptedRequestsCompleted];
    redactedRecords.forEach((redactedRecord) => {
      newCompleted.forEach((interceptedRecord, i) => {
        newCompleted[i] = redactedRecord;
      });
    });
    this.ctx.interceptedRequestsCompleted = newCompleted;
  }
}
