[yesno-http](../README.md) > ["http-serializer"](../modules/_http_serializer_.md) > [RequestSerializer](../classes/_http_serializer_.requestserializer.md)

# Class: RequestSerializer

## Hierarchy

 `Transform`

**↳ RequestSerializer**

## Implements

* `ReadableStream`
* `Writable`
* [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)

## Index

### Constructors

* [constructor](_http_serializer_.requestserializer.md#constructor)

### Properties

* [body](_http_serializer_.requestserializer.md#body)
* [headers](_http_serializer_.requestserializer.md#headers)
* [host](_http_serializer_.requestserializer.md#host)
* [method](_http_serializer_.requestserializer.md#method)
* [path](_http_serializer_.requestserializer.md#path)
* [port](_http_serializer_.requestserializer.md#port)
* [protocol](_http_serializer_.requestserializer.md#protocol)
* [query](_http_serializer_.requestserializer.md#query)
* [readable](_http_serializer_.requestserializer.md#readable)
* [readableHighWaterMark](_http_serializer_.requestserializer.md#readablehighwatermark)
* [readableLength](_http_serializer_.requestserializer.md#readablelength)
* [writable](_http_serializer_.requestserializer.md#writable)
* [writableHighWaterMark](_http_serializer_.requestserializer.md#writablehighwatermark)
* [writableLength](_http_serializer_.requestserializer.md#writablelength)
* [defaultMaxListeners](_http_serializer_.requestserializer.md#defaultmaxlisteners)

### Methods

* [__@asyncIterator](_http_serializer_.requestserializer.md#___asynciterator)
* [_destroy](_http_serializer_.requestserializer.md#_destroy)
* [_final](_http_serializer_.requestserializer.md#_final)
* [_flush](_http_serializer_.requestserializer.md#_flush)
* [_read](_http_serializer_.requestserializer.md#_read)
* [_transform](_http_serializer_.requestserializer.md#_transform)
* [_write](_http_serializer_.requestserializer.md#_write)
* [_writev](_http_serializer_.requestserializer.md#_writev)
* [addListener](_http_serializer_.requestserializer.md#addlistener)
* [cork](_http_serializer_.requestserializer.md#cork)
* [destroy](_http_serializer_.requestserializer.md#destroy)
* [emit](_http_serializer_.requestserializer.md#emit)
* [end](_http_serializer_.requestserializer.md#end)
* [eventNames](_http_serializer_.requestserializer.md#eventnames)
* [getMaxListeners](_http_serializer_.requestserializer.md#getmaxlisteners)
* [isPaused](_http_serializer_.requestserializer.md#ispaused)
* [listenerCount](_http_serializer_.requestserializer.md#listenercount)
* [listeners](_http_serializer_.requestserializer.md#listeners)
* [off](_http_serializer_.requestserializer.md#off)
* [on](_http_serializer_.requestserializer.md#on)
* [once](_http_serializer_.requestserializer.md#once)
* [pause](_http_serializer_.requestserializer.md#pause)
* [pipe](_http_serializer_.requestserializer.md#pipe)
* [prependListener](_http_serializer_.requestserializer.md#prependlistener)
* [prependOnceListener](_http_serializer_.requestserializer.md#prependoncelistener)
* [push](_http_serializer_.requestserializer.md#push)
* [rawListeners](_http_serializer_.requestserializer.md#rawlisteners)
* [read](_http_serializer_.requestserializer.md#read)
* [removeAllListeners](_http_serializer_.requestserializer.md#removealllisteners)
* [removeListener](_http_serializer_.requestserializer.md#removelistener)
* [resume](_http_serializer_.requestserializer.md#resume)
* [serialize](_http_serializer_.requestserializer.md#serialize)
* [setDefaultEncoding](_http_serializer_.requestserializer.md#setdefaultencoding)
* [setEncoding](_http_serializer_.requestserializer.md#setencoding)
* [setMaxListeners](_http_serializer_.requestserializer.md#setmaxlisteners)
* [uncork](_http_serializer_.requestserializer.md#uncork)
* [unpipe](_http_serializer_.requestserializer.md#unpipe)
* [unshift](_http_serializer_.requestserializer.md#unshift)
* [wrap](_http_serializer_.requestserializer.md#wrap)
* [write](_http_serializer_.requestserializer.md#write)
* [listenerCount](_http_serializer_.requestserializer.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new RequestSerializer**(originalClientOpts: *`RequestOptions`*, originalClientReq: *`ClientRequest`*, interceptedServerReq: *`IncomingMessage`*, isHttps: *`boolean`*): [RequestSerializer](_http_serializer_.requestserializer.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| originalClientOpts | `RequestOptions` |
| originalClientReq | `ClientRequest` |
| interceptedServerReq | `IncomingMessage` |
| isHttps | `boolean` |

**Returns:** [RequestSerializer](_http_serializer_.requestserializer.md)

___

## Properties

<a id="body"></a>

###  body

**● body**: * `string` &#124; `undefined`
*

___
<a id="headers"></a>

###  headers

**● headers**: *[IHeaders](../interfaces/_http_serializer_.iheaders.md)*

___
<a id="host"></a>

###  host

**● host**: *`string`*

___
<a id="method"></a>

###  method

**● method**: *`string`*

___
<a id="path"></a>

###  path

**● path**: *`string`*

___
<a id="port"></a>

###  port

**● port**: *`number`*

___
<a id="protocol"></a>

###  protocol

**● protocol**: * "http" &#124; "https"
*

___
<a id="query"></a>

### `<Optional>` query

**● query**: * `undefined` &#124; `string`
*

Query part _including_ `?`

___
<a id="readable"></a>

###  readable

**● readable**: *`boolean`*

___
<a id="readablehighwatermark"></a>

###  readableHighWaterMark

**● readableHighWaterMark**: *`number`*

___
<a id="readablelength"></a>

###  readableLength

**● readableLength**: *`number`*

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

<a id="___asynciterator"></a>

###  __@asyncIterator

▸ **__@asyncIterator**(): `AsyncIterableIterator`<`any`>

**Returns:** `AsyncIterableIterator`<`any`>

___
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
<a id="_flush"></a>

###  _flush

▸ **_flush**(callback: *`TransformCallback`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `TransformCallback` |

**Returns:** `void`

___
<a id="_read"></a>

###  _read

▸ **_read**(size: *`number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| size | `number` |

**Returns:** `void`

___
<a id="_transform"></a>

###  _transform

▸ **_transform**(chunk: *`Buffer`*, encoding: *`string`*, done: *`function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `Buffer` |
| encoding | `string` |
| done | `function` |

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
<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: *"close"*, listener: *`function`*): `this`

▸ **addListener**(event: *"data"*, listener: *`function`*): `this`

▸ **addListener**(event: *"end"*, listener: *`function`*): `this`

▸ **addListener**(event: *"readable"*, listener: *`function`*): `this`

▸ **addListener**(event: *"error"*, listener: *`function`*): `this`

▸ **addListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

Event emitter The defined events on documents including:

1.  close
2.  data
3.  end
4.  readable
5.  error

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
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
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="cork"></a>

###  cork

▸ **cork**(): `void`

**Returns:** `void`

___
<a id="destroy"></a>

###  destroy

▸ **destroy**(error?: *[Error](_errors_.yesnoerror.md#error)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` error | [Error](_errors_.yesnoerror.md#error) |

**Returns:** `void`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: *"close"*): `boolean`

▸ **emit**(event: *"data"*, chunk: *`any`*): `boolean`

▸ **emit**(event: *"end"*): `boolean`

▸ **emit**(event: *"readable"*): `boolean`

▸ **emit**(event: *"error"*, err: *`Error`*): `boolean`

▸ **emit**(event: * `string` &#124; `symbol`*, ...args: *`any`[]*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| chunk | `any` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |

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
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

**Returns:** `number`

___
<a id="ispaused"></a>

###  isPaused

▸ **isPaused**(): `boolean`

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

▸ **on**(event: *"data"*, listener: *`function`*): `this`

▸ **on**(event: *"end"*, listener: *`function`*): `this`

▸ **on**(event: *"readable"*, listener: *`function`*): `this`

▸ **on**(event: *"error"*, listener: *`function`*): `this`

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
| event | "data" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
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
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: *"close"*, listener: *`function`*): `this`

▸ **once**(event: *"data"*, listener: *`function`*): `this`

▸ **once**(event: *"end"*, listener: *`function`*): `this`

▸ **once**(event: *"readable"*, listener: *`function`*): `this`

▸ **once**(event: *"error"*, listener: *`function`*): `this`

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
| event | "data" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
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
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="pause"></a>

###  pause

▸ **pause**(): `this`

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

▸ **prependListener**(event: *"data"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"end"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"readable"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"error"*, listener: *`function`*): `this`

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
| event | "data" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
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
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: *"close"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"data"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"end"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"readable"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"error"*, listener: *`function`*): `this`

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
| event | "data" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
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
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="push"></a>

###  push

▸ **push**(chunk: *`any`*, encoding?: * `undefined` &#124; `string`*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| `Optional` encoding |  `undefined` &#124; `string`|

**Returns:** `boolean`

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
<a id="read"></a>

###  read

▸ **read**(size?: * `undefined` &#124; `number`*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` size |  `undefined` &#124; `number`|

**Returns:** `any`

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
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: *"close"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"data"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"end"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"readable"*, listener: *`function`*): `this`

▸ **removeListener**(event: *"error"*, listener: *`function`*): `this`

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
| event | "data" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
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
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="resume"></a>

###  resume

▸ **resume**(): `this`

**Returns:** `this`

___
<a id="serialize"></a>

###  serialize

▸ **serialize**(): [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)

**Returns:** [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)

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
<a id="setencoding"></a>

###  setEncoding

▸ **setEncoding**(encoding: *`string`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| encoding | `string` |

**Returns:** `this`

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
<a id="uncork"></a>

###  uncork

▸ **uncork**(): `void`

**Returns:** `void`

___
<a id="unpipe"></a>

###  unpipe

▸ **unpipe**(destination?: *`NodeJS.WritableStream`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` destination | `NodeJS.WritableStream` |

**Returns:** `this`

___
<a id="unshift"></a>

###  unshift

▸ **unshift**(chunk: *`any`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |

**Returns:** `void`

___
<a id="wrap"></a>

###  wrap

▸ **wrap**(oldStream: *`ReadableStream`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| oldStream | `ReadableStream` |

**Returns:** `this`

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

