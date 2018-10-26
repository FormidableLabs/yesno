import _ from 'lodash';
import {
  SerializedRequest,
  SerializedRequestResponse,
  SerializedResponse,
} from '../http-serializer';

type RequestQuery = { [P in keyof SerializedRequest]?: SerializedRequest[P] | RegExp };
type ResponseQuery = { [P in keyof SerializedResponse]?: SerializedResponse[P] | RegExp };

export interface ISerializedHttpPartialDeepMatch {
  url?: string | RegExp;
  request?: RequestQuery;
  response?: ResponseQuery;
}

export function filter(
  records: SerializedRequestResponse[],
  query: ISerializedHttpPartialDeepMatch,
): SerializedRequestResponse[] {
  return records.filter(doesMatchInterceptedFn(query));
}

/**
 * Curried function to determine whether a query matches an intercepted request.
 *
 * Query objects must be a deep partial match against the intercepted request.
 *
 * RegEx values are tested for match.
 */
function doesMatchInterceptedFn(
  query: ISerializedHttpPartialDeepMatch,
): (intercepted: SerializedRequestResponse) => boolean {
  const equalityOrRegExpDeep = (reqResValue: any, queryValue: any): boolean => {
    if (queryValue instanceof RegExp) {
      return queryValue.test(reqResValue);
    } else if (_.isPlainObject(queryValue)) {
      // Add a depth limit?
      return _.isMatchWith(reqResValue, queryValue, equalityOrRegExpDeep);
    } else {
      return queryValue === reqResValue;
    }
  };

  return (intercepted: SerializedRequestResponse): boolean => {
    let isMatch = true;

    if (query.url) {
      isMatch = isMatch && equalityOrRegExpDeep(intercepted.url, query.url);
    }

    if (query.request) {
      isMatch = isMatch && _.isMatchWith(intercepted.request, query.request, equalityOrRegExpDeep);
    }

    if (query.response) {
      isMatch =
        isMatch && _.isMatchWith(intercepted.response, query.response, equalityOrRegExpDeep);
    }

    return isMatch;
  };
}
