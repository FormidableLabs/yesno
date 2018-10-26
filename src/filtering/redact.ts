import * as _ from 'lodash';
import { SerializedRequestResponse } from '../http-serializer';

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
export function redact(
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
