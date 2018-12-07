///<reference types="node"/>

import * as Stream from 'stream';

declare module 'readable-stream' {
  export namespace Stream {}
}
