import _ from 'lodash';
import {
  formatUrl,
  ISerializedHttp,
  ISerializedRequest,
  ISerializedResponse,
} from '../http-serializer';

type RequestQuery = { [P in keyof ISerializedRequest]?: ISerializedRequest[P] | RegExp };
type ResponseQuery = { [P in keyof ISerializedResponse]?: ISerializedResponse[P] | RegExp };

export interface ISerializedHttpPartialDeepMatch {
  url?: string | RegExp;
  request?: RequestQuery;
  response?: ResponseQuery;
}

type MatchFn = (serialized: ISerializedHttp) => boolean;

/**
 * Curried function to determine whether a query matches an intercepted request.
 *
 * Query objects must be a deep partial match against the intercepted request.
 *
 * RegEx values are tested for match.
 */
export function match(
  fnOrPartialMatch: ISerializedHttpPartialDeepMatch | MatchFn,
): (intercepted: ISerializedHttp) => boolean {
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

  const matcher = _.isFunction(fnOrPartialMatch)
    ? fnOrPartialMatch
    : (serialized: ISerializedHttp): boolean => {
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

  return matcher;
}
