[yesno-http](../README.md) > ["interceptor"](../modules/_interceptor_.md) > [Interceptor](../classes/_interceptor_.interceptor.md)

# Class: Interceptor

## Hierarchy

 `EventEmitter`

**↳ Interceptor**

## Implements

* [IInterceptEvents](../interfaces/_interceptor_.iinterceptevents.md)

## Index

### Constructors

* [constructor](_interceptor_.interceptor.md#constructor)

### Properties

* [clientRequests](_interceptor_.interceptor.md#clientrequests)
* [ignorePorts](_interceptor_.interceptor.md#ignoreports)
* [mitm](_interceptor_.interceptor.md#mitm)
* [origOnSocket](_interceptor_.interceptor.md#origonsocket)
* [requestNumber](_interceptor_.interceptor.md#requestnumber)
* [shouldProxy](_interceptor_.interceptor.md#shouldproxy)
* [defaultMaxListeners](_interceptor_.interceptor.md#defaultmaxlisteners)

### Methods

* [addListener](_interceptor_.interceptor.md#addlistener)
* [disable](_interceptor_.interceptor.md#disable)
* [emit](_interceptor_.interceptor.md#emit)
* [enable](_interceptor_.interceptor.md#enable)
* [eventNames](_interceptor_.interceptor.md#eventnames)
* [getMaxListeners](_interceptor_.interceptor.md#getmaxlisteners)
* [getRequestId](_interceptor_.interceptor.md#getrequestid)
* [listenerCount](_interceptor_.interceptor.md#listenercount)
* [listeners](_interceptor_.interceptor.md#listeners)
* [mitmOnConnect](_interceptor_.interceptor.md#mitmonconnect)
* [mitmOnRequest](_interceptor_.interceptor.md#mitmonrequest)
* [off](_interceptor_.interceptor.md#off)
* [on](_interceptor_.interceptor.md#on)
* [once](_interceptor_.interceptor.md#once)
* [prependListener](_interceptor_.interceptor.md#prependlistener)
* [prependOnceListener](_interceptor_.interceptor.md#prependoncelistener)
* [proxy](_interceptor_.interceptor.md#proxy)
* [rawListeners](_interceptor_.interceptor.md#rawlisteners)
* [removeAllListeners](_interceptor_.interceptor.md#removealllisteners)
* [removeListener](_interceptor_.interceptor.md#removelistener)
* [setMaxListeners](_interceptor_.interceptor.md#setmaxlisteners)
* [trackSocketAndClientOptions](_interceptor_.interceptor.md#tracksocketandclientoptions)
* [listenerCount](_interceptor_.interceptor.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Interceptor**(options?: * `undefined` &#124; `object`*): [Interceptor](_interceptor_.interceptor.md)

*Defined in [interceptor.ts:60](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L60)*

Begin intercepting requests on instantiation

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options |  `undefined` &#124; `object`|

**Returns:** [Interceptor](_interceptor_.interceptor.md)

___

## Properties

<a id="clientrequests"></a>

### `<Private>` clientRequests

**● clientRequests**: *[ClientRequestTracker](../interfaces/_interceptor_.clientrequesttracker.md)*

*Defined in [interceptor.ts:57](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L57)*

___
<a id="ignoreports"></a>

### `<Private>` ignorePorts

**● ignorePorts**: *`number`[]* =  []

*Defined in [interceptor.ts:60](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L60)*

___
<a id="mitm"></a>

### `<Private>``<Optional>` mitm

**● mitm**: *`Mitm.Mitm`*

*Defined in [interceptor.ts:58](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L58)*

___
<a id="origonsocket"></a>

### `<Private>``<Optional>` origOnSocket

**● origOnSocket**: * `undefined` &#124; `function`
*

*Defined in [interceptor.ts:59](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L59)*

___
<a id="requestnumber"></a>

###  requestNumber

**● requestNumber**: *`number`* = 0

*Defined in [interceptor.ts:55](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L55)*

___
<a id="shouldproxy"></a>

### `<Private>` shouldProxy

**● shouldProxy**: *`boolean`* = true

*Defined in [interceptor.ts:56](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L56)*

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1080*

___

## Methods

<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.addListener*

*Overrides EventEmitter.addListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1082*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="disable"></a>

###  disable

▸ **disable**(): `void`

*Defined in [interceptor.ts:110](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L110)*

Disable request interception

**Returns:** `void`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: * `string` &#124; `symbol`*, ...args: *`any`[]*): `boolean`

*Inherited from EventEmitter.emit*

*Overrides EventEmitter.emit*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1094*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="enable"></a>

###  enable

▸ **enable**(options?: *[IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md)*): `void`

*Defined in [interceptor.ts:75](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L75)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| `Default value` options | [IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md) |  {} |

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
<a id="getrequestid"></a>

### `<Private>` getRequestId

▸ **getRequestId**(interceptedRequest: *`IncomingMessage`*): `string`

*Defined in [interceptor.ts:239](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L239)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| interceptedRequest | `IncomingMessage` |

**Returns:** `string`

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
<a id="mitmonconnect"></a>

### `<Private>` mitmOnConnect

▸ **mitmOnConnect**(socket: *`BypassableSocket`*, options: *[ProxyRequestOptions](../interfaces/_interceptor_.proxyrequestoptions.md)*): `void`

*Defined in [interceptor.ts:125](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L125)*

Event handler for Mitm "connect" event.

**Parameters:**

| Name | Type |
| ------ | ------ |
| socket | `BypassableSocket` |
| options | [ProxyRequestOptions](../interfaces/_interceptor_.proxyrequestoptions.md) |

**Returns:** `void`

___
<a id="mitmonrequest"></a>

### `<Private>` mitmOnRequest

▸ **mitmOnRequest**(interceptedRequest: *`IncomingMessage`*, interceptedResponse: *`ServerResponse`*): `void`

*Defined in [interceptor.ts:151](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L151)*

Event handler for Mitm "request" event.

Intercepted requests will be proxied if the `shouldProxy` option has been set.
*__emits__*: 'intercept' when we intercept a request

*__emits__*: 'proxied' when we have sent the response for a proxied response

**Parameters:**

| Name | Type |
| ------ | ------ |
| interceptedRequest | `IncomingMessage` |
| interceptedResponse | `ServerResponse` |

**Returns:** `void`

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

▸ **on**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.on*

*Overrides EventEmitter.on*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1083*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.once*

*Overrides EventEmitter.once*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1084*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1085*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1086*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="proxy"></a>

###  proxy

▸ **proxy**(shouldProxy: *`boolean`*): `void`

*Defined in [interceptor.ts:71](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L71)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| shouldProxy | `boolean` |

**Returns:** `void`

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

▸ **removeListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in E:/FormidableLabs/yesno/node_modules/@types/node/index.d.ts:1087*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

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
<a id="tracksocketandclientoptions"></a>

### `<Private>` trackSocketAndClientOptions

▸ **trackSocketAndClientOptions**(socket: *[RegisteredSocket](../interfaces/_interceptor_.registeredsocket.md)*, clientOptions: *[ProxyRequestOptions](../interfaces/_interceptor_.proxyrequestoptions.md)*): `void`

*Defined in [interceptor.ts:231](https://github.com/FormidableLabs/yesno/blob/61f406a/src/interceptor.ts#L231)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| socket | [RegisteredSocket](../interfaces/_interceptor_.registeredsocket.md) |
| clientOptions | [ProxyRequestOptions](../interfaces/_interceptor_.proxyrequestoptions.md) |

**Returns:** `void`

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

