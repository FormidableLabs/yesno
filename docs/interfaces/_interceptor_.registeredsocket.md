[yesno-http](../README.md) > ["interceptor"](../modules/_interceptor_.md) > [RegisteredSocket](../interfaces/_interceptor_.registeredsocket.md)

# Interface: RegisteredSocket

## Hierarchy

 `BypassableSocket`

**↳ RegisteredSocket**

## Implements

* `ReadableStream`
* `Writable`

## Index

### Constructors

* [constructor](_interceptor_.registeredsocket.md#constructor)

### Properties

* [__yesno_req_id](_interceptor_.registeredsocket.md#__yesno_req_id)
* [bufferSize](_interceptor_.registeredsocket.md#buffersize)
* [bytesRead](_interceptor_.registeredsocket.md#bytesread)
* [bytesWritten](_interceptor_.registeredsocket.md#byteswritten)
* [connecting](_interceptor_.registeredsocket.md#connecting)
* [destroyed](_interceptor_.registeredsocket.md#destroyed)
* [localAddress](_interceptor_.registeredsocket.md#localaddress)
* [localPort](_interceptor_.registeredsocket.md#localport)
* [readable](_interceptor_.registeredsocket.md#readable)
* [readableHighWaterMark](_interceptor_.registeredsocket.md#readablehighwatermark)
* [readableLength](_interceptor_.registeredsocket.md#readablelength)
* [remoteAddress](_interceptor_.registeredsocket.md#remoteaddress)
* [remoteFamily](_interceptor_.registeredsocket.md#remotefamily)
* [remotePort](_interceptor_.registeredsocket.md#remoteport)
* [writable](_interceptor_.registeredsocket.md#writable)
* [writableHighWaterMark](_interceptor_.registeredsocket.md#writablehighwatermark)
* [writableLength](_interceptor_.registeredsocket.md#writablelength)
* [defaultMaxListeners](_interceptor_.registeredsocket.md#defaultmaxlisteners)

### Methods

* [__@asyncIterator](_interceptor_.registeredsocket.md#___asynciterator)
* [_destroy](_interceptor_.registeredsocket.md#_destroy)
* [_final](_interceptor_.registeredsocket.md#_final)
* [_read](_interceptor_.registeredsocket.md#_read)
* [_write](_interceptor_.registeredsocket.md#_write)
* [_writev](_interceptor_.registeredsocket.md#_writev)
* [addListener](_interceptor_.registeredsocket.md#addlistener)
* [address](_interceptor_.registeredsocket.md#address)
* [bypass](_interceptor_.registeredsocket.md#bypass)
* [connect](_interceptor_.registeredsocket.md#connect)
* [cork](_interceptor_.registeredsocket.md#cork)
* [destroy](_interceptor_.registeredsocket.md#destroy)
* [emit](_interceptor_.registeredsocket.md#emit)
* [end](_interceptor_.registeredsocket.md#end)
* [eventNames](_interceptor_.registeredsocket.md#eventnames)
* [getMaxListeners](_interceptor_.registeredsocket.md#getmaxlisteners)
* [isPaused](_interceptor_.registeredsocket.md#ispaused)
* [listenerCount](_interceptor_.registeredsocket.md#listenercount)
* [listeners](_interceptor_.registeredsocket.md#listeners)
* [off](_interceptor_.registeredsocket.md#off)
* [on](_interceptor_.registeredsocket.md#on)
* [once](_interceptor_.registeredsocket.md#once)
* [pause](_interceptor_.registeredsocket.md#pause)
* [pipe](_interceptor_.registeredsocket.md#pipe)
* [prependListener](_interceptor_.registeredsocket.md#prependlistener)
* [prependOnceListener](_interceptor_.registeredsocket.md#prependoncelistener)
* [push](_interceptor_.registeredsocket.md#push)
* [rawListeners](_interceptor_.registeredsocket.md#rawlisteners)
* [read](_interceptor_.registeredsocket.md#read)
* [ref](_interceptor_.registeredsocket.md#ref)
* [removeAllListeners](_interceptor_.registeredsocket.md#removealllisteners)
* [removeListener](_interceptor_.registeredsocket.md#removelistener)
* [resume](_interceptor_.registeredsocket.md#resume)
* [setDefaultEncoding](_interceptor_.registeredsocket.md#setdefaultencoding)
* [setEncoding](_interceptor_.registeredsocket.md#setencoding)
* [setKeepAlive](_interceptor_.registeredsocket.md#setkeepalive)
* [setMaxListeners](_interceptor_.registeredsocket.md#setmaxlisteners)
* [setNoDelay](_interceptor_.registeredsocket.md#setnodelay)
* [setTimeout](_interceptor_.registeredsocket.md#settimeout)
* [uncork](_interceptor_.registeredsocket.md#uncork)
* [unpipe](_interceptor_.registeredsocket.md#unpipe)
* [unref](_interceptor_.registeredsocket.md#unref)
* [unshift](_interceptor_.registeredsocket.md#unshift)
* [wrap](_interceptor_.registeredsocket.md#wrap)
* [write](_interceptor_.registeredsocket.md#write)
* [listenerCount](_interceptor_.registeredsocket.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new RegisteredSocket**(options?: *`SocketConstructorOpts`*): [RegisteredSocket](_interceptor_.registeredsocket.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options | `SocketConstructorOpts` |

**Returns:** [RegisteredSocket](_interceptor_.registeredsocket.md)

___

## Properties

<a id="__yesno_req_id"></a>

### `<Optional>` __yesno_req_id

**● __yesno_req_id**: * `undefined` &#124; `string`
*

___
<a id="buffersize"></a>

###  bufferSize

**● bufferSize**: *`number`*

___
<a id="bytesread"></a>

###  bytesRead

**● bytesRead**: *`number`*

___
<a id="byteswritten"></a>

###  bytesWritten

**● bytesWritten**: *`number`*

___
<a id="connecting"></a>

###  connecting

**● connecting**: *`boolean`*

___
<a id="destroyed"></a>

###  destroyed

**● destroyed**: *`boolean`*

___
<a id="localaddress"></a>

###  localAddress

**● localAddress**: *`string`*

___
<a id="localport"></a>

###  localPort

**● localPort**: *`number`*

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
<a id="remoteaddress"></a>

### `<Optional>` remoteAddress

**● remoteAddress**: * `undefined` &#124; `string`
*

___
<a id="remotefamily"></a>

### `<Optional>` remoteFamily

**● remoteFamily**: * `undefined` &#124; `string`
*

___
<a id="remoteport"></a>

### `<Optional>` remotePort

**● remotePort**: * `undefined` &#124; `number`
*

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
<a id="_read"></a>

###  _read

▸ **_read**(size: *`number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| size | `number` |

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

▸ **addListener**(event: *`string`*, listener: *`function`*): `this`

▸ **addListener**(event: *"close"*, listener: *`function`*): `this`

▸ **addListener**(event: *"connect"*, listener: *`function`*): `this`

▸ **addListener**(event: *"data"*, listener: *`function`*): `this`

▸ **addListener**(event: *"drain"*, listener: *`function`*): `this`

▸ **addListener**(event: *"end"*, listener: *`function`*): `this`

▸ **addListener**(event: *"error"*, listener: *`function`*): `this`

▸ **addListener**(event: *"lookup"*, listener: *`function`*): `this`

▸ **addListener**(event: *"timeout"*, listener: *`function`*): `this`

events.EventEmitter

1.  close
2.  connect
3.  data
4.  drain
5.  end
6.  error
7.  lookup
8.  timeout

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "connect" |
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
| event | "drain" |
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
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "lookup" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "timeout" |
| listener | `function` |

**Returns:** `this`

___
<a id="address"></a>

###  address

▸ **address**():  `AddressInfo` &#124; `string`

**Returns:**  `AddressInfo` &#124; `string`

___
<a id="bypass"></a>

###  bypass

▸ **bypass**(): `void`

**Returns:** `void`

___
<a id="connect"></a>

###  connect

▸ **connect**(options: *`SocketConnectOpts`*, connectionListener?: *`Function`*): `this`

▸ **connect**(port: *`number`*, host: *`string`*, connectionListener?: *`Function`*): `this`

▸ **connect**(port: *`number`*, connectionListener?: *`Function`*): `this`

▸ **connect**(path: *`string`*, connectionListener?: *`Function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | `SocketConnectOpts` |
| `Optional` connectionListener | `Function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| port | `number` |
| host | `string` |
| `Optional` connectionListener | `Function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| port | `number` |
| `Optional` connectionListener | `Function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |
| `Optional` connectionListener | `Function` |

**Returns:** `this`

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

▸ **emit**(event: * `string` &#124; `symbol`*, ...args: *`any`[]*): `boolean`

▸ **emit**(event: *"close"*, had_error: *`boolean`*): `boolean`

▸ **emit**(event: *"connect"*): `boolean`

▸ **emit**(event: *"data"*, data: *`Buffer`*): `boolean`

▸ **emit**(event: *"drain"*): `boolean`

▸ **emit**(event: *"end"*): `boolean`

▸ **emit**(event: *"error"*, err: *`Error`*): `boolean`

▸ **emit**(event: *"lookup"*, err: *`Error`*, address: *`string`*, family: * `string` &#124; `number`*, host: *`string`*): `boolean`

▸ **emit**(event: *"timeout"*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| `Rest` args | `any`[] |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| had_error | `boolean` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "connect" |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "data" |
| data | `Buffer` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "drain" |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "end" |

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
| event | "lookup" |
| err | `Error` |
| address | `string` |
| family |  `string` &#124; `number`|
| host | `string` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "timeout" |

**Returns:** `boolean`

___
<a id="end"></a>

###  end

▸ **end**(): `void`

▸ **end**(buffer: *`Buffer`*, cb?: *`Function`*): `void`

▸ **end**(str: *`string`*, cb?: *`Function`*): `void`

▸ **end**(str: *`string`*, encoding?: * `undefined` &#124; `string`*, cb?: *`Function`*): `void`

▸ **end**(data?: *`any`*, encoding?: * `undefined` &#124; `string`*): `void`

**Returns:** `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| buffer | `Buffer` |
| `Optional` cb | `Function` |

**Returns:** `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |
| `Optional` cb | `Function` |

**Returns:** `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |
| `Optional` encoding |  `undefined` &#124; `string`|
| `Optional` cb | `Function` |

**Returns:** `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` data | `any` |
| `Optional` encoding |  `undefined` &#124; `string`|

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

▸ **on**(event: *`string`*, listener: *`function`*): `this`

▸ **on**(event: *"close"*, listener: *`function`*): `this`

▸ **on**(event: *"connect"*, listener: *`function`*): `this`

▸ **on**(event: *"data"*, listener: *`function`*): `this`

▸ **on**(event: *"drain"*, listener: *`function`*): `this`

▸ **on**(event: *"end"*, listener: *`function`*): `this`

▸ **on**(event: *"error"*, listener: *`function`*): `this`

▸ **on**(event: *"lookup"*, listener: *`function`*): `this`

▸ **on**(event: *"timeout"*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "connect" |
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
| event | "drain" |
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
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "lookup" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "timeout" |
| listener | `function` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: *`string`*, listener: *`function`*): `this`

▸ **once**(event: *"close"*, listener: *`function`*): `this`

▸ **once**(event: *"connect"*, listener: *`function`*): `this`

▸ **once**(event: *"data"*, listener: *`function`*): `this`

▸ **once**(event: *"drain"*, listener: *`function`*): `this`

▸ **once**(event: *"end"*, listener: *`function`*): `this`

▸ **once**(event: *"error"*, listener: *`function`*): `this`

▸ **once**(event: *"lookup"*, listener: *`function`*): `this`

▸ **once**(event: *"timeout"*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "connect" |
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
| event | "drain" |
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
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "lookup" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "timeout" |
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

▸ **prependListener**(event: *`string`*, listener: *`function`*): `this`

▸ **prependListener**(event: *"close"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"connect"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"data"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"drain"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"end"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"error"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"lookup"*, listener: *`function`*): `this`

▸ **prependListener**(event: *"timeout"*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "connect" |
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
| event | "drain" |
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
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "lookup" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "timeout" |
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: *`string`*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"close"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"connect"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"data"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"drain"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"end"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"error"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"lookup"*, listener: *`function`*): `this`

▸ **prependOnceListener**(event: *"timeout"*, listener: *`function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | `string` |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "close" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "connect" |
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
| event | "drain" |
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
| event | "error" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "lookup" |
| listener | `function` |

**Returns:** `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "timeout" |
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
<a id="ref"></a>

###  ref

▸ **ref**(): `void`

**Returns:** `void`

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

▸ **setEncoding**(encoding?: * `undefined` &#124; `string`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` encoding |  `undefined` &#124; `string`|

**Returns:** `this`

___
<a id="setkeepalive"></a>

###  setKeepAlive

▸ **setKeepAlive**(enable?: * `undefined` &#124; `false` &#124; `true`*, initialDelay?: * `undefined` &#124; `number`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` enable |  `undefined` &#124; `false` &#124; `true`|
| `Optional` initialDelay |  `undefined` &#124; `number`|

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
<a id="setnodelay"></a>

###  setNoDelay

▸ **setNoDelay**(noDelay?: * `undefined` &#124; `false` &#124; `true`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` noDelay |  `undefined` &#124; `false` &#124; `true`|

**Returns:** `this`

___
<a id="settimeout"></a>

###  setTimeout

▸ **setTimeout**(timeout: *`number`*, callback?: *`Function`*): `this`

**Parameters:**

| Name | Type |
| ------ | ------ |
| timeout | `number` |
| `Optional` callback | `Function` |

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
<a id="unref"></a>

###  unref

▸ **unref**(): `void`

**Returns:** `void`

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

▸ **write**(buffer: *`Buffer`*): `boolean`

▸ **write**(buffer: *`Buffer`*, cb?: *`Function`*): `boolean`

▸ **write**(str: *`string`*, cb?: *`Function`*): `boolean`

▸ **write**(str: *`string`*, encoding?: * `undefined` &#124; `string`*, cb?: *`Function`*): `boolean`

▸ **write**(str: *`string`*, encoding?: * `undefined` &#124; `string`*, fd?: * `undefined` &#124; `string`*): `boolean`

▸ **write**(data: *`any`*, encoding?: * `undefined` &#124; `string`*, callback?: *`Function`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| buffer | `Buffer` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| buffer | `Buffer` |
| `Optional` cb | `Function` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |
| `Optional` cb | `Function` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |
| `Optional` encoding |  `undefined` &#124; `string`|
| `Optional` cb | `Function` |

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| str | `string` |
| `Optional` encoding |  `undefined` &#124; `string`|
| `Optional` fd |  `undefined` &#124; `string`|

**Returns:** `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| data | `any` |
| `Optional` encoding |  `undefined` &#124; `string`|
| `Optional` callback | `Function` |

**Returns:** `void`

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

