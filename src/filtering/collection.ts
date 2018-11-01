import * as _ from 'lodash';
import { DEFAULT_REDACT_SYMBOL } from '../consts';
import Context from '../context';
import { ISerializedHttp } from '../http-serializer';
import { ISerializedHttpPartialDeepMatch, match, MatchFn } from './matcher';
import { redact, Redactor } from './redact';

export interface IFiltered {
  redact: (property: string | string[], symbol: Redactor) => void;
  intercepted: () => ISerializedHttp[];
  mocks: () => ISerializedHttp[];
}

export interface IFilteredHttpCollectionParams {
  context: Context;
  matcher?: ISerializedHttpPartialDeepMatch | MatchFn;
}

export default class FilteredHttpCollection implements IFiltered {
  private readonly ctx: Context;
  private readonly matcher: ISerializedHttpPartialDeepMatch | MatchFn;

  constructor({ context, matcher = {} }: IFilteredHttpCollectionParams) {
    this.ctx = context;
    this.matcher = matcher;
  }

  public intercepted(): ISerializedHttp[] {
    return this.ctx.interceptedRequestsCompleted.filter(match(this.matcher));
  }

  public mocks(): ISerializedHttp[] {
    return this.ctx.loadedMocks.filter(match(this.matcher));
  }

  public redact(
    property: string | string[],
    redactor: Redactor = () => DEFAULT_REDACT_SYMBOL,
  ): void {
    const properties: string[] = _.isArray(property) ? property : [property];

    const redactedRecords = this.intercepted().map((intercepted) =>
      redact(intercepted, properties, redactor),
    );

    const newCompleted = [...this.ctx.interceptedRequestsCompleted];
    redactedRecords.forEach((redactedRecord) => {
      newCompleted.forEach((interceptedRecord, i) => {
        newCompleted[i] = redactedRecord;
      });
    });
    this.ctx.interceptedRequestsCompleted = newCompleted;
  }
}
