import Context from './context';
import { doesMatchInterceptedFn, IQueryRecords, redact } from './helpers';
import { SerializedRequestResponse } from './http-serializer';

export type RedactSymbol = string | ((value: any, path: string) => string);

export interface IQueryable {
  redact: (property: string | string[], symbol: RedactSymbol) => void;
  intercepted: () => SerializedRequestResponse[];
  mocks: () => SerializedRequestResponse[];
}

interface IQueryableRequestsCollectionParams {
  context: Context;
  defaultRedactSymbol: RedactSymbol;
  query?: IQueryRecords;
}

export default class QueryableRequestsCollection implements IQueryable {
  private readonly ctx: Context;
  private readonly query: IQueryRecords;
  private readonly defaultRedactSymbol: RedactSymbol;

  constructor({ context, defaultRedactSymbol, query = {} }: IQueryableRequestsCollectionParams) {
    this.ctx = context;
    this.query = query;
    this.defaultRedactSymbol = defaultRedactSymbol;
  }

  public intercepted(): SerializedRequestResponse[] {
    return this.filter(this.ctx.interceptedRequestsCompleted, this.query);
  }

  public mocks(): SerializedRequestResponse[] {
    return this.filter(this.ctx.loadedMocks, this.query);
  }

  public redact(property: string | string[], redactSymbol?: RedactSymbol): void {
    redactSymbol = redactSymbol || this.defaultRedactSymbol;
    const redactedRecords = redact(this.intercepted(), property, redactSymbol);

    const newCompleted = [...this.ctx.interceptedRequestsCompleted];
    redactedRecords.forEach((redactedRecord) => {
      newCompleted.forEach((interceptedRecord, i) => {
        newCompleted[i] = redactedRecord;
      });
    });
    this.ctx.interceptedRequestsCompleted = newCompleted;
  }

  // @todo Move out of class?
  private filter(
    records: SerializedRequestResponse[],
    query: IQueryRecords,
  ): SerializedRequestResponse[] {
    return records.filter(doesMatchInterceptedFn(query));
  }
}
