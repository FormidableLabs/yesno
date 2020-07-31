import { PartialResponseForRequest } from './filtering/collection';
import { byUrl as comparatorByUrl, ComparatorFn } from './filtering/comparator';
import { match, Matcher } from './filtering/matcher';
import { Redactor } from './filtering/redact';
import {
  ISerializedHttp,
  ISerializedRequest,
  ISerializedResponse,
  RequestSerializer,
} from './http-serializer';
import { RecordMode as Mode } from './recording';
import Rule from './rule';

export interface IRedactProp {
  property: string | string[];
  redactor?: Redactor;
}

export interface IInFlightRequest {
  startTime: number;
  requestSerializer: RequestSerializer;
}

export interface IResponseForMatchingRequest {
  response: PartialResponseForRequest;
  matcher: Matcher;
}

/**
 * Store the current execution context for YesNo by tracking requests & mocks.
 */
export default class Context {
  public mode: Mode = Mode.Spy;
  public rules: Rule[] = [];

  /**
   * Setting to redact all incoming requests to match redacted mocks
   */
  public autoRedact: IRedactProp | null = null;

  /**
   * Completed serialized request-response objects. Used for:
   * A. Assertions
   * B. Saved to disk if in record mode
   */
  public interceptedRequestsCompleted: ISerializedHttp[] = [];

  /**
   * Serialized records loaded from disk.
   */
  public loadedMocks: ISerializedHttp[] = [];

  /**
   * Proxied requests which have not yet responded. When completed
   * the value is set to "null" but the index is preserved.
   */
  public inFlightRequests: Array<IInFlightRequest | null> = [];

  public ignoresForMatchingRequests: IResponseForMatchingRequest[] = [];

  public responsesForMatchingRequests: IResponseForMatchingRequest[] = [];

  public comparatorFn: ComparatorFn = comparatorByUrl;

  public clear() {
    this.ignoresForMatchingRequests = [];
    this.interceptedRequestsCompleted = [];
    this.inFlightRequests = [];
    this.loadedMocks = [];
    this.responsesForMatchingRequests = [];
    this.comparatorFn = comparatorByUrl;
  }

  public getMatchingMocks(matcher: Matcher): ISerializedHttp[] {
    return this.loadedMocks.filter(match(matcher));
  }

  public getMatchingIntercepted(matcher: Matcher): ISerializedHttp[] {
    return this.interceptedRequestsCompleted.filter(match(matcher));
  }

  public hasResponsesDefinedForMatchers(): boolean {
    return !!this.responsesForMatchingRequests.length;
  }

  public addResponseForMatchingRequests(matchingResponse: IResponseForMatchingRequest): void {
    this.responsesForMatchingRequests.push(matchingResponse);
  }

  public getResponseDefinedMatching(request: ISerializedRequest): ISerializedResponse | undefined {
    let firstMatchingResponse: ISerializedResponse | undefined;

    for (const { matcher, response } of this.responsesForMatchingRequests) {
      const doesMatch = match(matcher)({ request });

      if (doesMatch) {
        firstMatchingResponse = {
          body: {},
          headers: {},
          ...(typeof response === 'function' ? response(request) : response),
        };
        break;
      }
    }

    return firstMatchingResponse;
  }

  public addIgnoreForMatchingRequests(matchingResponse: IResponseForMatchingRequest): void {
    this.ignoresForMatchingRequests.push(matchingResponse);
  }

  public hasMatchingIgnore(request: ISerializedRequest): boolean {
    if (!this.ignoresForMatchingRequests.length) {
      return false;
    }

    for (const { matcher } of this.ignoresForMatchingRequests) {
      if (match(matcher)({ request })) {
        return true;
      }
    }

    return false;
  }
}
