[yesno-http](../README.md) > ["interceptor"](../modules/_interceptor_.md) > [Interceptor](../classes/_interceptor_.interceptor.md)

# Class: Interceptor

Intercept outbound HTTP requests and provide mock responses through an event API.

Uses MITM library to spy on HTTP requests made in current NodeJS process.

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
* [comparatorFn](_interceptor_.interceptor.md#comparatorfn)
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

___
<a id="comparatorfn"></a>

### `<Private>``<Optional>` comparatorFn

**● comparatorFn**: *[ComparatorFn](../modules/_filtering_comparator_.md#comparatorfn)*

___
<a id="ignoreports"></a>

### `<Private>` ignorePorts

**● ignorePorts**: *`number`[]* =  []

___
<a id="mitm"></a>

### `<Private>``<Optional>` mitm

**● mitm**: *`Mitm.Mitm`*

___
<a id="origonsocket"></a>

### `<Private>``<Optional>` origOnSocket

**● origOnSocket**: * `undefined` &#124; `function`
*

___
<a id="requestnumber"></a>

###  requestNumber

**● requestNumber**: *`number`* = 0

___
<a id="shouldproxy"></a>

### `<Private>` shouldProxy

**● shouldProxy**: *`boolean`* = true

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

___

## Methods

<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

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

Disables intercepting outbound HTTP requests.

**Returns:** `void`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: * `string` &#124; `symbol`*, ...args: *`any`[]*): `boolean`

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

Enables intercepting all outbound HTTP requests.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` options | [IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md) |  {} |  Intercept options |

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
<a id="getrequestid"></a>

### `<Private>` getRequestId

▸ **getRequestId**(interceptedRequest: *`IncomingMessage`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| interceptedRequest | `IncomingMessage` |

**Returns:** `string`

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
<a id="mitmonconnect"></a>

### `<Private>` mitmOnConnect

▸ **mitmOnConnect**(socket: *`BypassableSocket`*, options: *[ProxyRequestOptions](../interfaces/_interceptor_.proxyrequestoptions.md)*): `void`

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

Enable/disable proxying. If proxying, requests are not sent to their original destination.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| shouldProxy | `boolean` |  Whether or not to proxy |

**Returns:** `void`

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
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

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

**Parameters:**

| Name | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="tracksocketandclientoptions"></a>

### `<Private>` trackSocketAndClientOptions

▸ **trackSocketAndClientOptions**(socket: *[RegisteredSocket](../interfaces/_interceptor_.registeredsocket.md)*, clientOptions: *[ProxyRequestOptions](../interfaces/_interceptor_.proxyrequestoptions.md)*): `void`

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

*__deprecated__*: since v4.0.0

**Parameters:**

| Name | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event |  `string` &#124; `symbol`|

**Returns:** `number`

___

