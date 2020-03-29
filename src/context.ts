import { PartialResponseForRequest } from './filtering/collection';
import { match, Matcher } from './filtering/matcher';
import {
  ISerializedHttp,
  ISerializedRequest,
  ISerializedResponse,
  RequestSerializer,
} from './http-serializer';
import { RecordMode as Mode } from './recording';

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

  public responsesForMatchingRequests: IResponseForMatchingRequest[] = [];

  public clear() {
    this.interceptedRequestsCompleted = [];
    this.inFlightRequests = [];
    this.loadedMocks = [];
    this.responsesForMatchingRequests = [];
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
}
