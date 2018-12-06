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

Proxied requests which have not yet responded. When completed the value is set to "null" but the index is preserved.

___
<a id="interceptedrequestscompleted"></a>

###  interceptedRequestsCompleted

**● interceptedRequestsCompleted**: *[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]* =  []

Completed serialized request-response objects. Used for: A. Assertions B. Saved to disk if in record mode

___
<a id="loadedmocks"></a>

###  loadedMocks

**● loadedMocks**: *[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]* =  []

Serialized records loaded from disk.

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `void`

**Returns:** `void`

___

