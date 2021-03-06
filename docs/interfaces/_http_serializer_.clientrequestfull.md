[yesno-http](../README.md) > ["http-serializer"](../modules/_http_serializer_.md) > [ClientRequestFull](../interfaces/_http_serializer_.clientrequestfull.md)

# Interface: ClientRequestFull

## Hierarchy

 `ClientRequest`

**↳ ClientRequestFull**

## Implements

* `WritableStream`

## Index

### Constructors

* [constructor](_http_serializer_.clientrequestfull.md#constructor)

### Properties

* [aborted](_http_serializer_.clientrequestfull.md#aborted)
* [agent](_http_serializer_.clientrequestfull.md#agent)
* [chunkedEncoding](_http_serializer_.clientrequestfull.md#chunkedencoding)
* [connection](_http_serializer_.clientrequestfull.md#connection)
* [finished](_http_serializer_.clientrequestfull.md#finished)
* [headersSent](_http_serializer_.clientrequestfull.md#headerssent)
* [path](_http_serializer_.clientrequestfull.md#path)
* [sendDate](_http_serializer_.clientrequestfull.md#senddate)
* [shouldKeepAlive](_http_serializer_.clientrequestfull.md#shouldkeepalive)
* [socket](_http_serializer_.clientrequestfull.md#socket)
* [upgrading](_http_serializer_.clientrequestfull.md#upgrading)
* [useChunkedEncodingByDefault](_http_serializer_.clientrequestfull.md#usechunkedencodingbydefault)
* [writable](_http_serializer_.clientrequestfull.md#writable)
* [writableHighWaterMark](_http_serializer_.clientrequestfull.md#writablehighwatermark)
* [writableLength](_http_serializer_.clientrequestfull.md#writablelength)
* [defaultMaxListeners](_http_serializer_.clientrequestfull.md#defaultmaxlisteners)

### Methods

* [_destroy](_http_serializer_.clientrequestfull.md#_destroy)
* [_final](_http_serializer_.clientrequestfull.md#_final)
* [_write](_http_serializer_.clientrequestfull.md#_write)
* [_writev](_http_serializer_.clientrequestfull.md#_writev)
* [abort](_http_serializer_.clientrequestfull.md#abort)
* [addListener](_http_serializer_.clientrequestfull.md#addlistener)
* [addTrailers](_http_serializer_.clientrequestfull.md#addtrailers)
* [cork](_http_serializer_.clientrequestfull.md#cork)
* [destroy](_http_serializer_.clientrequestfull.md#destroy)
* [emit](_http_serializer_.clientrequestfull.md#emit)
* [end](_http_serializer_.clientrequestfull.md#end)
* [eventNames](_http_serializer_.clientrequestfull.md#eventnames)
* [flushHeaders](_http_serializer_.clientrequestfull.md#flushheaders)
* [getHeader](_http_serializer_.clientrequestfull.md#getheader)
* [getHeaderNames](_http_serializer_.clientrequestfull.md#getheadernames)
* [getHeaders](_http_serializer_.clientrequestfull.md#getheaders)
* [getMaxListeners](_http_serializer_.clientrequestfull.md#getmaxlisteners)
* [hasHeader](_http_serializer_.clientrequestfull.md#hasheader)
* [listenerCount](_http_serializer_.clientrequestfull.md#listenercount)
* [listeners](_http_serializer_.clientrequestfull.md#listeners)
* [off](_http_serializer_.clientrequestfull.md#off)
* [on](_http_serializer_.clientrequestfull.md#on)
* [onSocket](_http_serializer_.clientrequestfull.md#onsocket)
* [once](_http_serializer_.clientrequestfull.md#once)
* [pipe](_http_serializer_.clientrequestfull.md#pipe)
* [prependListener](_http_serializer_.clientrequestfull.md#prependlistener)
* [prependOnceListener](_http_serializer_.clientrequestfull.md#prependoncelistener)
* [rawListeners](_http_serializer_.clientrequestfull.md#rawlisteners)
* [removeAllListeners](_http_serializer_.clientrequestfull.md#removealllisteners)
* [removeHeader](_http_serializer_.clientrequestfull.md#removeheader)
* [removeListener](_http_serializer_.clientrequestfull.md#removelistener)
* [setDefaultEncoding](_http_serializer_.clientrequestfull.md#setdefaultencoding)
* [setHeader](_http_serializer_.clientrequestfull.md#setheader)
* [setMaxListeners](_http_serializer_.clientrequestfull.md#setmaxlisteners)
* [setNoDelay](_http_serializer_.clientrequestfull.md#setnodelay)
* [setSocketKeepAlive](_http_serializer_.clientrequestfull.md#setsocketkeepalive)
* [setTimeout](_http_serializer_.clientrequestfull.md#settimeout)
* [uncork](_http_serializer_.clientrequestfull.md#uncork)
* [write](_http_serializer_.clientrequestfull.md#write)
* [listenerCount](_http_serializer_.clientrequestfull.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ClientRequestFull**(url: * `string` &#124; `URL` &#124; `ClientRequestArgs`*, cb?: * `undefined` &#124; `function`*): [ClientRequestFull](_http_serializer_.clientrequestfull.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| url |  `string` &#124; `URL` &#124; `ClientRequestArgs`|
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** [ClientRequestFull](_http_serializer_.clientrequestfull.md)

___

## Properties

<a id="aborted"></a>

###  aborted

**● aborted**: *`number`*

___
<a id="agent"></a>

### `<Optional>` agent

**● agent**: * `undefined` &#124; `object`
*

___
<a id="chunkedencoding"></a>

###  chunkedEncoding

**● chunkedEncoding**: *`boolean`*

___
<a id="connection"></a>

###  connection

**● connection**: *`Socket`*

___
<a id="finished"></a>

###  finished

**● finished**: *`boolean`*

___
<a id="headerssent"></a>

###  headersSent

**● headersSent**: *`boolean`*

___
<a id="path"></a>

###  path

**● path**: *`string`*

___
<a id="senddate"></a>

###  sendDate

**● sendDate**: *`boolean`*

___
<a id="shouldkeepalive"></a>

###  shouldKeepAlive

**● shouldKeepAlive**: *`boolean`*

___
<a id="socket"></a>

###  socket

**● socket**: *`Socket`*

___
<a id="upgrading"></a>

###  upgrading

**● upgrading**: *`boolean`*

___
<a id="usechunkedencodingbydefault"></a>

###  useChunkedEncodingByDefault

**● useChunkedEncodingByDefault**: *`boolean`*

___
<a id="writable"></a>

###  writable

**● writable**: *`boolean`*

___
<a id="writablehighwatermark"></a>

###  writableHighWaterMark

**● writableHighWaterMark**: *`number`*

___
<a id="writablelength"></a>

###  writableLength

**● writableLength**: *`number`*

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

___

## Methods

<a id="_destroy"></a>

###  _destroy

▸ **_destroy**(error: * `Error` &#124; `null`*, callback: *`function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| error |  `Error` &#124; `null`|
| callback | `function` |

**Returns:** `void`

___
<a id="_final"></a>

###  _final

▸ **_final**(callback: *`function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="_write"></a>

###  _write

▸ **_write**(chunk: *`any`*, encoding: *`string`*, callback: *`function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| encoding | `string` |
| callback | `function` |

**Returns:** `void`

___
<a id="_writev"></a>

### `<Optional>` _writev

▸ **_writev**(chunks: *`Array`<`object`>*, callback: *`function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunks | `Array`<`object`> |
| callback | `function` |

**Returns:** `void`

___
<a id="abort"></a>

###  abort

▸ **abort**(): `void`

**Returns:** `void`

___
<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *"close"*, listener: *`function`*): `this`

▸ **addListener**(event: *"drain"*, listener: *`function`*): `this`

▸ **addListener**(event: *"error"*, listener: *`function`*): `this`

▸ **addListener**(event: *"finish"*, listener: *`function`*): `this`

▸ **addListener**(event: *"pipe"*, listener: *`function`*): `this`

▸ **addListener**(event: *"unpipe"*, listener: *`function`*): `this`

▸ **addListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

Event emitter The defined events on documents including:

1.  close
2.  drain
3.  error
4.  finish
5.  pipe
6.  unpipe

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "drain" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "finish" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "pipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "unpipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="addtrailers"></a>

###  addTrailers

▸ **addTrailers**(headers: * `OutgoingHttpHeaders` &#124; `Array`<[`string`, `string`]>*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| headers |  `OutgoingHttpHeaders` &#124; `Array`<[`string`, `string`]>|

**Returns:** `void`

___
<a id="cork"></a>

###  cork

▸ **cork**(): `void`

**Returns:** `void`

___
<a id="destroy"></a>

###  destroy

▸ **destroy**(error?: *[Error](../classes/_errors_.yesnoerror.md#error)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` error | [Error](../classes/_errors_.yesnoerror.md#error) |

**Returns:** `void`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: *"close"*): `boolean`

▸ **emit**(event: *"drain"*): `boolean`

▸ **emit**(event: *"error"*, err: *`Error`*): `boolean`

▸ **emit**(event: *"finish"*): `boolean`

▸ **emit**(event: *"pipe"*, src: *`Readable`*): `boolean`

▸ **emit**(event: *"unpipe"*, src: *`Readable`*): `boolean`

▸ **emit**(event: * `string` &#124; `symbol`*, ...args: *`any`[]*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "drain" |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| err | `Error` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "finish" |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "pipe" |
| src | `Readable` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "unpipe" |
| src | `Readable` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="end"></a>

###  end

▸ **end**(cb?: * `undefined` &#124; `function`*): `void`

▸ **end**(chunk: *`any`*, cb?: * `undefined` &#124; `function`*): `void`

▸ **end**(chunk: *`any`*, encoding?: * `undefined` &#124; `string`*, cb?: * `undefined` &#124; `function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| `Optional` encoding |  `undefined` &#124; `string`|
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** `void`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`< `string` &#124; `symbol`>

**Returns:** `Array`< `string` &#124; `symbol`>

___
<a id="flushheaders"></a>

###  flushHeaders

▸ **flushHeaders**(): `void`

**Returns:** `void`

___
<a id="getheader"></a>

###  getHeader

▸ **getHeader**(name: *`string`*):  `number` &#124; `string` &#124; `string`[] &#124; `undefined`

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:**  `number` &#124; `string` &#124; `string`[] &#124; `undefined`

___
<a id="getheadernames"></a>

###  getHeaderNames

▸ **getHeaderNames**(): `string`[]

**Returns:** `string`[]

___
<a id="getheaders"></a>

###  getHeaders

▸ **getHeaders**(): `OutgoingHttpHeaders`

**Returns:** `OutgoingHttpHeaders`

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

**Returns:** `number`

___
<a id="hasheader"></a>

###  hasHeader

▸ **hasHeader**(name: *`string`*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `boolean`

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: * `string` &#124; `symbol`*): `number`

**Parameters:**

| Name | Type |
| ------ | ------ |
| type |  `string` &#124; `symbol`|

**Returns:** `number`

___
<a id="listeners"></a>

###  listeners

▸ **listeners**(event: * `string` &#124; `symbol`*): `Function`[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|

**Returns:** `Function`[]

___
<a id="off"></a>

###  off

▸ **off**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="on"></a>

###  on

▸ **on**(event: *"close"*, listener: *`function`*): `this`

▸ **on**(event: *"drain"*, listener: *`function`*): `this`

▸ **on**(event: *"error"*, listener: *`function`*): `this`

▸ **on**(event: *"finish"*, listener: *`function`*): `this`

▸ **on**(event: *"pipe"*, listener: *`function`*): `this`

▸ **on**(event: *"unpipe"*, listener: *`function`*): `this`

▸ **on**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "drain" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "finish" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "pipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "unpipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="onsocket"></a>

###  onSocket

▸ **onSocket**(socket: *`Socket`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| socket | `Socket` |

**Returns:** `void`

___
<a id="once"></a>

###  once

▸ **once**(event: *"close"*, listener: *`function`*): `this`

▸ **once**(event: *"drain"*, listener: *`function`*): `this`

▸ **once**(event: *"error"*, listener: *`function`*): `this`

▸ **once**(event: *"finish"*, listener: *`function`*): `this`

▸ **once**(event: *"pipe"*, listener: *`function`*): `this`

▸ **once**(event: *"unpipe"*, listener: *`function`*): `this`

▸ **once**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "drain" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "finish" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "pipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "unpipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="pipe"></a>

###  pipe

▸ **pipe**<`T`>(destination: *`T`*, options?: * `undefined` &#124; `object`*): `T`

**Type parameters:**

#### T :  `WritableStream`
**Parameters:**

| Name | Type |
| ------ | ------ |
| destination | `T` |
| `Optional` options |  `undefined` &#124; `object`|

**Returns:** `T`

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: *"close"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"drain"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"error"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"finish"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"pipe"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"unpipe"*, listener: *`function`*): `this`

▸ **prependListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "drain" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "finish" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "pipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "unpipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: *"close"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"drain"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"error"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"finish"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"pipe"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"unpipe"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "drain" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "finish" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "pipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "unpipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="rawlisteners"></a>

###  rawListeners

▸ **rawListeners**(event: * `string` &#124; `symbol`*): `Function`[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|

**Returns:** `Function`[]

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event?: * `string` &#124; `symbol`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` event |  `string` &#124; `symbol`|

**Returns:** `this`

___
<a id="removeheader"></a>

###  removeHeader

▸ **removeHeader**(name: *`string`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |

**Returns:** `void`

___
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: *"close"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"drain"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"error"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"finish"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"pipe"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"unpipe"*, listener: *`function`*): `this`

▸ **removeListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "drain" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "finish" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "pipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "unpipe" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="setdefaultencoding"></a>

###  setDefaultEncoding

▸ **setDefaultEncoding**(encoding: *`string`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| encoding | `string` |

**Returns:** `this`

___
<a id="setheader"></a>

###  setHeader

▸ **setHeader**(name: *`string`*, value: * `number` &#124; `string` &#124; `string`[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| value |  `number` &#124; `string` &#124; `string`[]|

**Returns:** `void`

___
<a id="setmaxlisteners"></a>

###  setMaxListeners

▸ **setMaxListeners**(n: *`number`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="setnodelay"></a>

###  setNoDelay

▸ **setNoDelay**(noDelay?: * `undefined` &#124; `false` &#124; `true`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` noDelay |  `undefined` &#124; `false` &#124; `true`|

**Returns:** `void`

___
<a id="setsocketkeepalive"></a>

###  setSocketKeepAlive

▸ **setSocketKeepAlive**(enable?: * `undefined` &#124; `false` &#124; `true`*, initialDelay?: * `undefined` &#124; `number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` enable |  `undefined` &#124; `false` &#124; `true`|
| `Optional` initialDelay |  `undefined` &#124; `number`|

**Returns:** `void`

___
<a id="settimeout"></a>

###  setTimeout

▸ **setTimeout**(timeout: *`number`*, callback?: * `undefined` &#124; `function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| timeout | `number` |
| `Optional` callback |  `undefined` &#124; `function`|

**Returns:** `this`

___
<a id="uncork"></a>

###  uncork

▸ **uncork**(): `void`

**Returns:** `void`

___
<a id="write"></a>

###  write

▸ **write**(chunk: *`any`*, cb?: * `undefined` &#124; `function`*): `boolean`

▸ **write**(chunk: *`any`*, encoding?: * `undefined` &#124; `string`*, cb?: * `undefined` &#124; `function`*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| `Optional` encoding |  `undefined` &#124; `string`|
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** `boolean`

___
<a id="listenercount-1"></a>

### `<Static>` listenerCount

▸ **listenerCount**(emitter: *`EventEmitter`*, event: * `string` &#124; `symbol`*): `number`

*__deprecated__*: since v4.0.0

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event |  `string` &#124; `symbol`|

**Returns:** `number`

___

