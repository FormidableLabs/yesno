[yesno-http](../README.md) > ["http-serializer"](../modules/_http_serializer_.md) > [ResponseSerializer](../classes/_http_serializer_.responseserializer.md)

# Class: ResponseSerializer

## Hierarchy

 `Transform`

**↳ ResponseSerializer**

## Implements

* `ReadableStream`
* `Writable`
* [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)

## Index

### Constructors

* [constructor](_http_serializer_.responseserializer.md#constructor)

### Properties

* [body](_http_serializer_.responseserializer.md#body)
* [headers](_http_serializer_.responseserializer.md#headers)
* [readable](_http_serializer_.responseserializer.md#readable)
* [readableHighWaterMark](_http_serializer_.responseserializer.md#readablehighwatermark)
* [readableLength](_http_serializer_.responseserializer.md#readablelength)
* [statusCode](_http_serializer_.responseserializer.md#statuscode)
* [writable](_http_serializer_.responseserializer.md#writable)
* [writableHighWaterMark](_http_serializer_.responseserializer.md#writablehighwatermark)
* [writableLength](_http_serializer_.responseserializer.md#writablelength)
* [defaultMaxListeners](_http_serializer_.responseserializer.md#defaultmaxlisteners)

### Methods

* [__@asyncIterator](_http_serializer_.responseserializer.md#___asynciterator)
* [_destroy](_http_serializer_.responseserializer.md#_destroy)
* [_final](_http_serializer_.responseserializer.md#_final)
* [_flush](_http_serializer_.responseserializer.md#_flush)
* [_read](_http_serializer_.responseserializer.md#_read)
* [_transform](_http_serializer_.responseserializer.md#_transform)
* [_write](_http_serializer_.responseserializer.md#_write)
* [_writev](_http_serializer_.responseserializer.md#_writev)
* [addListener](_http_serializer_.responseserializer.md#addlistener)
* [cork](_http_serializer_.responseserializer.md#cork)
* [destroy](_http_serializer_.responseserializer.md#destroy)
* [emit](_http_serializer_.responseserializer.md#emit)
* [end](_http_serializer_.responseserializer.md#end)
* [eventNames](_http_serializer_.responseserializer.md#eventnames)
* [getMaxListeners](_http_serializer_.responseserializer.md#getmaxlisteners)
* [isPaused](_http_serializer_.responseserializer.md#ispaused)
* [listenerCount](_http_serializer_.responseserializer.md#listenercount)
* [listeners](_http_serializer_.responseserializer.md#listeners)
* [off](_http_serializer_.responseserializer.md#off)
* [on](_http_serializer_.responseserializer.md#on)
* [once](_http_serializer_.responseserializer.md#once)
* [pause](_http_serializer_.responseserializer.md#pause)
* [pipe](_http_serializer_.responseserializer.md#pipe)
* [prependListener](_http_serializer_.responseserializer.md#prependlistener)
* [prependOnceListener](_http_serializer_.responseserializer.md#prependoncelistener)
* [push](_http_serializer_.responseserializer.md#push)
* [rawListeners](_http_serializer_.responseserializer.md#rawlisteners)
* [read](_http_serializer_.responseserializer.md#read)
* [removeAllListeners](_http_serializer_.responseserializer.md#removealllisteners)
* [removeListener](_http_serializer_.responseserializer.md#removelistener)
* [resume](_http_serializer_.responseserializer.md#resume)
* [serialize](_http_serializer_.responseserializer.md#serialize)
* [setDefaultEncoding](_http_serializer_.responseserializer.md#setdefaultencoding)
* [setEncoding](_http_serializer_.responseserializer.md#setencoding)
* [setMaxListeners](_http_serializer_.responseserializer.md#setmaxlisteners)
* [uncork](_http_serializer_.responseserializer.md#uncork)
* [unpipe](_http_serializer_.responseserializer.md#unpipe)
* [unshift](_http_serializer_.responseserializer.md#unshift)
* [wrap](_http_serializer_.responseserializer.md#wrap)
* [write](_http_serializer_.responseserializer.md#write)
* [listenerCount](_http_serializer_.responseserializer.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ResponseSerializer**(clientResponse: *`IncomingMessage`*): [ResponseSerializer](_http_serializer_.responseserializer.md)

*Overrides Transform.__constructor*

*Defined in [http-serializer.ts:149](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/http-serializer.ts#L149)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| clientResponse | `IncomingMessage` |

**Returns:** [ResponseSerializer](_http_serializer_.responseserializer.md)

___

## Properties

<a id="body"></a>

###  body

**● body**: * `string` &#124; `any`
*

*Defined in [http-serializer.ts:147](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/http-serializer.ts#L147)*

___
<a id="headers"></a>

###  headers

**● headers**: *[IHeaders](../interfaces/_http_serializer_.iheaders.md)*

*Defined in [http-serializer.ts:148](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/http-serializer.ts#L148)*

___
<a id="readable"></a>

###  readable

**● readable**: *`boolean`*

*Inherited from Readable.readable*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6495*

___
<a id="readablehighwatermark"></a>

###  readableHighWaterMark

**● readableHighWaterMark**: *`number`*

*Inherited from Readable.readableHighWaterMark*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6496*

___
<a id="readablelength"></a>

###  readableLength

**● readableLength**: *`number`*

*Inherited from Readable.readableLength*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6497*

___
<a id="statuscode"></a>

###  statusCode

**● statusCode**: *`number`*

*Defined in [http-serializer.ts:149](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/http-serializer.ts#L149)*

___
<a id="writable"></a>

###  writable

**● writable**: *`boolean`*

*Inherited from Duplex.writable*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6682*

___
<a id="writablehighwatermark"></a>

###  writableHighWaterMark

**● writableHighWaterMark**: *`number`*

*Inherited from Duplex.writableHighWaterMark*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6683*

___
<a id="writablelength"></a>

###  writableLength

**● writableLength**: *`number`*

*Inherited from Duplex.writableLength*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6684*

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1080*

___

## Methods

<a id="___asynciterator"></a>

###  __@asyncIterator

▸ **__@asyncIterator**(): `AsyncIterableIterator`<`any`>

*Inherited from Readable.[Symbol.asyncIterator]*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6570*

**Returns:** `AsyncIterableIterator`<`any`>

___
<a id="_destroy"></a>

###  _destroy

▸ **_destroy**(error: * `Error` &#124; `null`*, callback: *`function`*): `void`

*Inherited from Duplex._destroy*

*Overrides Readable._destroy*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6688*

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

*Inherited from Duplex._final*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6689*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `function` |

**Returns:** `void`

___
<a id="_flush"></a>

###  _flush

▸ **_flush**(callback: *`TransformCallback`*): `void`

*Inherited from Transform._flush*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6715*

**Parameters:**

| Name | Type |
| ------ | ------ |
| callback | `TransformCallback` |

**Returns:** `void`

___
<a id="_read"></a>

###  _read

▸ **_read**(size: *`number`*): `void`

*Inherited from Readable._read*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6499*

**Parameters:**

| Name | Type |
| ------ | ------ |
| size | `number` |

**Returns:** `void`

___
<a id="_transform"></a>

###  _transform

▸ **_transform**(chunk: *`Buffer`*, encoding: *`string`*, done: *`function`*): `void`

*Overrides Transform._transform*

*Defined in [http-serializer.ts:159](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/http-serializer.ts#L159)*

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

*Inherited from Duplex._write*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6686*

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

*Inherited from Duplex._writev*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6687*

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

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6521*

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

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6522*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6523*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6524*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6525*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.addListener*

*Overrides EventEmitter.addListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6526*

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

*Inherited from Duplex.cork*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6696*

**Returns:** `void`

___
<a id="destroy"></a>

###  destroy

▸ **destroy**(error?: *[Error](_errors_.yesnoerror.md#error)*): `void`

*Inherited from Readable.destroy*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6510*

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

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6528*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6529*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| chunk | `any` |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6530*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6531*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6532*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| err | `Error` |

**Returns:** `boolean`

*Inherited from Readable.emit*

*Overrides EventEmitter.emit*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6533*

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

*Inherited from Duplex.end*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6693*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** `void`

*Inherited from Duplex.end*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6694*

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** `void`

*Inherited from Duplex.end*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6695*

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

*Inherited from EventEmitter.eventNames*

*Overrides EventEmitter.eventNames*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1095*

**Returns:** `Array`< `string` &#124; `symbol`>

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1091*

**Returns:** `number`

___
<a id="ispaused"></a>

###  isPaused

▸ **isPaused**(): `boolean`

*Inherited from Readable.isPaused*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6504*

**Returns:** `boolean`

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: * `string` &#124; `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Overrides EventEmitter.listenerCount*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1096*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type |  `string` &#124; `symbol`|

**Returns:** `number`

___
<a id="listeners"></a>

###  listeners

▸ **listeners**(event: * `string` &#124; `symbol`*): `Function`[]

*Inherited from EventEmitter.listeners*

*Overrides EventEmitter.listeners*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1092*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|

**Returns:** `Function`[]

___
<a id="off"></a>

###  off

▸ **off**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.off*

*Overrides EventEmitter.off*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1088*

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

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6535*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6536*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6537*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6538*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6539*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.on*

*Overrides EventEmitter.on*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6540*

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

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6542*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6543*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6544*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6545*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6546*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.once*

*Overrides EventEmitter.once*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6547*

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

*Inherited from Readable.pause*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6502*

**Returns:** `this`

___
<a id="pipe"></a>

###  pipe

▸ **pipe**<`T`>(destination: *`T`*, options?: * `undefined` &#124; `object`*): `T`

*Inherited from internal.pipe*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6480*

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

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6549*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6550*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6551*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6552*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6553*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6554*

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

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6556*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6557*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6558*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6559*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6560*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6561*

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

*Inherited from Readable.push*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6508*

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

*Inherited from EventEmitter.rawListeners*

*Overrides EventEmitter.rawListeners*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1093*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|

**Returns:** `Function`[]

___
<a id="read"></a>

###  read

▸ **read**(size?: * `undefined` &#124; `number`*): `any`

*Inherited from Readable.read*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6500*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` size |  `undefined` &#124; `number`|

**Returns:** `any`

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event?: * `string` &#124; `symbol`*): `this`

*Inherited from EventEmitter.removeAllListeners*

*Overrides EventEmitter.removeAllListeners*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1089*

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

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6563*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6564*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6565*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6566*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "readable" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6567*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "error" |
| listener | `function` |

**Returns:** `this`

*Inherited from Readable.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6568*

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

*Inherited from Readable.resume*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6503*

**Returns:** `this`

___
<a id="serialize"></a>

###  serialize

▸ **serialize**(): [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)

*Defined in [http-serializer.ts:166](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/http-serializer.ts#L166)*

**Returns:** [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)

___
<a id="setdefaultencoding"></a>

###  setDefaultEncoding

▸ **setDefaultEncoding**(encoding: *`string`*): `this`

*Inherited from Duplex.setDefaultEncoding*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6692*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encoding | `string` |

**Returns:** `this`

___
<a id="setencoding"></a>

###  setEncoding

▸ **setEncoding**(encoding: *`string`*): `this`

*Inherited from Readable.setEncoding*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6501*

**Parameters:**

| Name | Type |
| ------ | ------ |
| encoding | `string` |

**Returns:** `this`

___
<a id="setmaxlisteners"></a>

###  setMaxListeners

▸ **setMaxListeners**(n: *`number`*): `this`

*Inherited from EventEmitter.setMaxListeners*

*Overrides EventEmitter.setMaxListeners*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1090*

**Parameters:**

| Name | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="uncork"></a>

###  uncork

▸ **uncork**(): `void`

*Inherited from Duplex.uncork*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6697*

**Returns:** `void`

___
<a id="unpipe"></a>

###  unpipe

▸ **unpipe**(destination?: *`NodeJS.WritableStream`*): `this`

*Inherited from Readable.unpipe*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6505*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` destination | `NodeJS.WritableStream` |

**Returns:** `this`

___
<a id="unshift"></a>

###  unshift

▸ **unshift**(chunk: *`any`*): `void`

*Inherited from Readable.unshift*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6506*

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |

**Returns:** `void`

___
<a id="wrap"></a>

###  wrap

▸ **wrap**(oldStream: *`ReadableStream`*): `this`

*Inherited from Readable.wrap*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6507*

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

*Inherited from Duplex.write*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6690*

**Parameters:**

| Name | Type |
| ------ | ------ |
| chunk | `any` |
| `Optional` cb |  `undefined` &#124; `function`|

**Returns:** `boolean`

*Inherited from Duplex.write*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:6691*

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

*Inherited from EventEmitter.listenerCount*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1079*

*__deprecated__*: since v4.0.0

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event |  `string` &#124; `symbol`|

**Returns:** `number`

___

