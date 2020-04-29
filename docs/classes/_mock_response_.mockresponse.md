[yesno-http](../README.md) > ["mock-response"](../modules/_mock_response_.md) > [MockResponse](../classes/_mock_response_.mockresponse.md)

# Class: MockResponse

Encapsulates logic for sending a response for an intercepted HTTP request

## Hierarchy

**MockResponse**

## Index

### Constructors

* [constructor](_mock_response_.mockresponse.md#constructor)

### Properties

* [ctx](_mock_response_.mockresponse.md#ctx)
* [event](_mock_response_.mockresponse.md#event)

### Methods

* [assertMockMatches](_mock_response_.mockresponse.md#assertmockmatches)
* [getMockForIntecept](_mock_response_.mockresponse.md#getmockforintecept)
* [send](_mock_response_.mockresponse.md#send)
* [writeMockResponse](_mock_response_.mockresponse.md#writemockresponse)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new MockResponse**(event: *[IInterceptEvent](../interfaces/_interceptor_.iinterceptevent.md)*, ctx: *[Context](_context_.context.md)*): [MockResponse](_mock_response_.mockresponse.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | [IInterceptEvent](../interfaces/_interceptor_.iinterceptevent.md) |
| ctx | [Context](_context_.context.md) |

**Returns:** [MockResponse](_mock_response_.mockresponse.md)

___

## Properties

<a id="ctx"></a>

### `<Private>` ctx

**● ctx**: *[Context](_context_.context.md)*

___
<a id="event"></a>

### `<Private>` event

**● event**: *[IInterceptEvent](../interfaces/_interceptor_.iinterceptevent.md)*

___

## Methods

<a id="assertmockmatches"></a>

### `<Private>` assertMockMatches

▸ **assertMockMatches**(__namedParameters: *`object`*): `void`

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| mock | [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md) |
| requestNumber | `number` |
| serializedRequest | [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md) |

**Returns:** `void`

___
<a id="getmockforintecept"></a>

### `<Private>` getMockForIntecept

▸ **getMockForIntecept**(__namedParameters: *`object`*): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| requestNumber | `number` |

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

___
<a id="send"></a>

###  send

▸ **send**(): `Promise`< [ISeralizedRequestResponse](../interfaces/_http_serializer_.iseralizedrequestresponse.md) &#124; `undefined`>

Send a respond for our wrapped intercept event if able.

Give precedence to matching responses in shared context (from `yesno.matching().respond()`). Else, if we're in mock mode, lookup the mock response.

**Returns:** `Promise`< [ISeralizedRequestResponse](../interfaces/_http_serializer_.iseralizedrequestresponse.md) &#124; `undefined`>
The received request & sent response. Returns `undefined` if unable to respond

___
<a id="writemockresponse"></a>

### `<Private>` writeMockResponse

▸ **writeMockResponse**(response: *[ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)*, interceptedResponse: *`ServerResponse`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| response | [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md) |
| interceptedResponse | `ServerResponse` |

**Returns:** `void`

___

