import * as _ from 'lodash';
import { doesMatchInterceptedFn, ISerializedHttpPartialDeepMatch } from './comparator';
import { DEFAULT_REDACT_SYMBOL } from './consts';
import Context from './context';
import { SerializedRequestResponse } from './http-serializer';

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
    return this.filter(this.ctx.interceptedRequestsCompleted, this.query);
  }

  public mocks(): SerializedRequestResponse[] {
    return this.filter(this.ctx.loadedMocks, this.query);
  }

  public redact(property: string | string[], redactSymbol?: RedactSymbol): void {
    redactSymbol = redactSymbol || DEFAULT_REDACT_SYMBOL;
    const redactedRecords = this.redactWithRecords(this.intercepted(), property, redactSymbol);

    const newCompleted = [...this.ctx.interceptedRequestsCompleted];
    redactedRecords.forEach((redactedRecord) => {
      newCompleted.forEach((interceptedRecord, i) => {
        newCompleted[i] = redactedRecord;
      });
    });
    this.ctx.interceptedRequestsCompleted = newCompleted;
  }

  /**
   * Redact properties on the matching intercepted records.
   *
   * Use a `.` to reference a nested property and square brackets to reference an array
   *
   * ```
   *  redact({ a: { b: [{ c: 1}] } }), 'a.b[].c')
   * ```
   *
   * There is no syntax to reference an array value by index.
   *
   * Performs a DFS upon each record.
   * @todo Benchmark & investigate alternatives
   * @param property  Property or array of properties to redact. Add `[]` to indicate array.
   * @param redactSymbol Symbol to use for redacted properties or function to compute.
   */
  private redactWithRecords(
    records: SerializedRequestResponse[],
    property: string | string[],
    redactSymbol: string | ((value: any, path: string) => string),
  ): SerializedRequestResponse[] {
    // redactSymbol = redactSymbol || this.yesno.redactSymbol;
    const properties = _.isArray(property) ? property : [property];
    const redactFn = (propPath: string, node: any, currentPath = ''): any => {
      if (currentPath && currentPath === propPath) {
        return _.isFunction(redactSymbol) ? redactSymbol(node, propPath) : (redactSymbol as string);
      }

      if (currentPath && !propPath.includes(currentPath)) {
        return node;
      }

      if (_.isPlainObject(node)) {
        return _.mapValues(node as object, (nextNode, key) => {
          const pathForNextNode = currentPath ? `${currentPath}.${key}` : key;
          return redactFn(propPath, nextNode, pathForNextNode);
        });
      }

      if (_.isArray(node)) {
        currentPath += '[]';

        return node.map((nextNode) => redactFn(propPath, nextNode, currentPath));
      }

      return node;
    };

    return records.map((record) => {
      return properties.reduce((redacted, propertyToRedact) => {
        return redactFn(propertyToRedact, redacted);
      }, record);
    });
  }

  // @todo Move out of class?
  private filter(
    records: SerializedRequestResponse[],
    query: ISerializedHttpPartialDeepMatch,
  ): SerializedRequestResponse[] {
    return records.filter(doesMatchInterceptedFn(query));
  }
}
