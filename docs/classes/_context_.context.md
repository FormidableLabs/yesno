[yesno-http](../README.md) > ["context"](../modules/_context_.md) > [Context](../classes/_context_.context.md)

# Class: Context

## Hierarchy

**Context**

## Index

### Properties

* [inFlightRequests](_context_.context.md#inflightrequests)
* [interceptedRequestsCompleted](_context_.context.md#interceptedrequestscompleted)
* [loadedMocks](_context_.context.md#loadedmocks)

### Methods

* [clear](_context_.context.md#clear)

---

## Properties

<a id="inflightrequests"></a>

###  inFlightRequests

**● inFlightRequests**: *`Array`< [IInFlightRequest](../interfaces/_context_.iinflightrequest.md) &#124; `null`>* =  []

*Defined in [context.ts:23](https://github.com/FormidableLabs/yesno/blob/61f406a/src/context.ts#L23)*

Proxied requests which have not yet responded. When completed the value is set to "null" but the index is preserved.

___
<a id="interceptedrequestscompleted"></a>

###  interceptedRequestsCompleted

**● interceptedRequestsCompleted**: *[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]* =  []

*Defined in [context.ts:14](https://github.com/FormidableLabs/yesno/blob/61f406a/src/context.ts#L14)*

Completed serialized request-response objects. Used for: A. Assertions B. Saved to disk if in record mode

___
<a id="loadedmocks"></a>

###  loadedMocks

**● loadedMocks**: *[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]* =  []

*Defined in [context.ts:18](https://github.com/FormidableLabs/yesno/blob/61f406a/src/context.ts#L18)*

Serialized records loaded from disk.

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `void`

*Defined in [context.ts:25](https://github.com/FormidableLabs/yesno/blob/61f406a/src/context.ts#L25)*

**Returns:** `void`

___

