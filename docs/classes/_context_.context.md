[yesno-http](../README.md) > ["context"](../modules/_context_.md) > [Context](../classes/_context_.context.md)

# Class: Context

Store the current execution context for YesNo by tracking requests & mocks.

## Hierarchy

**Context**

## Index

### Properties

* [comparatorFn](_context_.context.md#comparatorfn)
* [ignoresForMatchingRequests](_context_.context.md#ignoresformatchingrequests)
* [inFlightRequests](_context_.context.md#inflightrequests)
* [interceptedRequestsCompleted](_context_.context.md#interceptedrequestscompleted)
* [loadedMocks](_context_.context.md#loadedmocks)
* [mode](_context_.context.md#mode)
* [responsesForMatchingRequests](_context_.context.md#responsesformatchingrequests)

### Methods

* [addIgnoreForMatchingRequests](_context_.context.md#addignoreformatchingrequests)
* [addResponseForMatchingRequests](_context_.context.md#addresponseformatchingrequests)
* [clear](_context_.context.md#clear)
* [getMatchingIntercepted](_context_.context.md#getmatchingintercepted)
* [getMatchingMocks](_context_.context.md#getmatchingmocks)
* [getResponseDefinedMatching](_context_.context.md#getresponsedefinedmatching)
* [hasMatchingIgnore](_context_.context.md#hasmatchingignore)
* [hasResponsesDefinedForMatchers](_context_.context.md#hasresponsesdefinedformatchers)

---

## Properties

<a id="comparatorfn"></a>

###  comparatorFn

**● comparatorFn**: *[ComparatorFn](../modules/_filtering_comparator_.md#comparatorfn)* =  comparatorByUrl

___
<a id="ignoresformatchingrequests"></a>

###  ignoresForMatchingRequests

**● ignoresForMatchingRequests**: *[IResponseForMatchingRequest](../interfaces/_context_.iresponseformatchingrequest.md)[]* =  []

___
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
<a id="mode"></a>

###  mode

**● mode**: *`Mode`* =  Mode.Spy

___
<a id="responsesformatchingrequests"></a>

###  responsesForMatchingRequests

**● responsesForMatchingRequests**: *[IResponseForMatchingRequest](../interfaces/_context_.iresponseformatchingrequest.md)[]* =  []

___

## Methods

<a id="addignoreformatchingrequests"></a>

###  addIgnoreForMatchingRequests

▸ **addIgnoreForMatchingRequests**(matchingResponse: *[IResponseForMatchingRequest](../interfaces/_context_.iresponseformatchingrequest.md)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| matchingResponse | [IResponseForMatchingRequest](../interfaces/_context_.iresponseformatchingrequest.md) |

**Returns:** `void`

___
<a id="addresponseformatchingrequests"></a>

###  addResponseForMatchingRequests

▸ **addResponseForMatchingRequests**(matchingResponse: *[IResponseForMatchingRequest](../interfaces/_context_.iresponseformatchingrequest.md)*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| matchingResponse | [IResponseForMatchingRequest](../interfaces/_context_.iresponseformatchingrequest.md) |

**Returns:** `void`

___
<a id="clear"></a>

###  clear

▸ **clear**(): `void`

**Returns:** `void`

___
<a id="getmatchingintercepted"></a>

###  getMatchingIntercepted

▸ **getMatchingIntercepted**(matcher: *[Matcher](../modules/_filtering_matcher_.md#matcher)*): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| matcher | [Matcher](../modules/_filtering_matcher_.md#matcher) |

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="getmatchingmocks"></a>

###  getMatchingMocks

▸ **getMatchingMocks**(matcher: *[Matcher](../modules/_filtering_matcher_.md#matcher)*): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

**Parameters:**

| Name | Type |
| ------ | ------ |
| matcher | [Matcher](../modules/_filtering_matcher_.md#matcher) |

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="getresponsedefinedmatching"></a>

###  getResponseDefinedMatching

▸ **getResponseDefinedMatching**(request: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*):  [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md) &#124; `undefined`

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md) |

**Returns:**  [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md) &#124; `undefined`

___
<a id="hasmatchingignore"></a>

###  hasMatchingIgnore

▸ **hasMatchingIgnore**(request: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md) |

**Returns:** `boolean`

___
<a id="hasresponsesdefinedformatchers"></a>

###  hasResponsesDefinedForMatchers

▸ **hasResponsesDefinedForMatchers**(): `boolean`

**Returns:** `boolean`

___

