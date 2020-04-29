import _ from 'lodash';
import {
  formatUrl,
  ISerializedRequest,
  ISerializedRequestResponse,
  ISerializedResponse,
} from '../http-serializer';

export type RequestQuery = { [P in keyof ISerializedRequest]?: ISerializedRequest[P] | RegExp };
export type ResponseQuery = { [P in keyof ISerializedResponse]?: ISerializedResponse[P] | RegExp };

export interface ISerializedHttpPartialDeepMatch {
  url?: string | RegExp;
  request?: RequestQuery;
  response?: ResponseQuery;
}

export interface ISerializedRequestResponseToMatch {
  request: ISerializedRequest;
  response?: ISerializedResponse;
}

export type MatchFn = (serialized: ISerializedRequestResponse) => boolean;

export type UnsafeMatchFn = (serialized: ISerializedRequestResponseToMatch) => boolean;

export type Matcher = ISerializedHttpPartialDeepMatch | MatchFn;

export const EMPTY_RESPONSE = { body: {}, headers: {}, statusCode: 0 };

/**
 * Curried function to determine whether a query matches an intercepted request.
 *
 * Query objects must be a deep partial match against the intercepted request.
 *
 * RegEx values are tested for match.
 */
export function match(fnOrPartialMatch: ISerializedHttpPartialDeepMatch | MatchFn): UnsafeMatchFn {
  const equalityOrRegExpDeep = (reqResValue: any, queryValue: any): boolean => {
    if (queryValue instanceof RegExp) {
      return queryValue.test(reqResValue);
    } else if (_.isPlainObject(queryValue) || _.isArray(queryValue)) {
      // Add a depth limit?
      return _.isMatchWith(reqResValue, queryValue, equalityOrRegExpDeep);
    } else {
      return queryValue === reqResValue;
    }
  };

  const matcher: MatchFn = _.isFunction(fnOrPartialMatch)
    ? fnOrPartialMatch
    : (serialized: ISerializedRequestResponse): boolean => {
        const query = fnOrPartialMatch as ISerializedHttpPartialDeepMatch;
        let isMatch = true;

        if (query.url) {
          const matchUrlNoPort = equalityOrRegExpDeep(formatUrl(serialized.request), query.url);
          const matchUrlPort = equalityOrRegExpDeep(formatUrl(serialized.request, true), query.url);
          isMatch = isMatch && (matchUrlNoPort || matchUrlPort);
        }

        if (query.request) {
          isMatch =
            isMatch && _.isMatchWith(serialized.request, query.request, equalityOrRegExpDeep);
        }

        if (query.response) {
          isMatch =
            isMatch && _.isMatchWith(serialized.response, query.response, equalityOrRegExpDeep);
        }

        return isMatch;
      };

  return (serialized: ISerializedRequestResponseToMatch) =>
    matcher({
      request: serialized.request,
      // Response will be empty if matching against requests
      response: serialized.response || EMPTY_RESPONSE,
    });
}
