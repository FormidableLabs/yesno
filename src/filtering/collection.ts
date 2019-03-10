import * as _ from 'lodash';
import { EOL } from 'os';
import { DEFAULT_REDACT_SYMBOL } from '../consts';
import Context from '../context';
import { YesNoError } from '../errors';
import {
  formatUrl,
  IJSONBody,
  ISerializedHttp,
  ISerializedRequest,
  ISerializedResponse,
} from '../http-serializer';
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

  public intercepted<T = IJSONBody, S = IJSONBody>(): Array<ISerializedHttp<T, S>> {
    return this.ctx.interceptedRequestsCompleted.filter(match(this.matcher)) as Array<
      ISerializedHttp<T, S>
    >;
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

    redactedRecords.forEach((redactedRecord) => {
      const i = this.ctx.interceptedRequestsCompleted.findIndex((req) => {
        return redactedRecord.__id === req.__id;
      });
      this.ctx.interceptedRequestsCompleted[i] = redactedRecord;
    });
  }

  /**
   * Return serialized request part of the _single_ matching intercepted HTTP request.
   *
   * Throws an exception if multiple requests were matched.
   */
  public request<T = IJSONBody, S = IJSONBody>(): ISerializedRequest<T> {
    return this.only<T, S>().request;
  }

  /**
   * Return serialized response part of the _single_ matching intercepted HTTP request.
   *
   * Throws an exception if multiple requests were matched.
   */
  public response<T = IJSONBody, S = IJSONBody>(): ISerializedResponse<S> {
    return this.only<T, S>().response;
  }

  private only<T, S>(): ISerializedHttp<T, S> {
    const intercepted = this.intercepted();
    const all = this.ctx.interceptedRequestsCompleted;

    if (!intercepted.length) {
      const nonMatchingHint = all
        .map(({ request }, i) => `  ${i + 1}. ${request.method} ${formatUrl(request)}`)
        .slice(0, 6)
        .join(EOL);
      const queryHint = _.isObject(this.matcher)
        ? JSON.stringify(
            this.matcher,
            (key, value) => (value instanceof RegExp ? `RegExp(${value.toString()})` : value),
            2,
          )
        : 'Function';
      const numNotShown =
        this.ctx.interceptedRequestsCompleted.length > 6
          ? this.ctx.interceptedRequestsCompleted.length - 6
          : 0;
      // tslint:disable-next-line:max-line-length
      const help = `  ${EOL}Query:${EOL}${queryHint}${EOL}${EOL}Non-matching intercepted:${EOL}${nonMatchingHint}${
        numNotShown ? ` (+${numNotShown} more)` : ''
      }`;
      throw new YesNoError(`No matching intercepted requests ${help}`);
    }

    if (intercepted.length > 1) {
      throw new YesNoError(`Query unexpectedly matched multiple (${intercepted.length}) requests.`);
    }

    return intercepted[0] as ISerializedHttp<T, S>;
  }
}
