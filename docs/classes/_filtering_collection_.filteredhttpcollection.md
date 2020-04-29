[yesno-http](../README.md) > ["filtering/collection"](../modules/_filtering_collection_.md) > [FilteredHttpCollection](../classes/_filtering_collection_.filteredhttpcollection.md)

# Class: FilteredHttpCollection

Represents a collection of HTTP requests which match the provided filter.

Can filter both intercepted HTTP requests and loaded mocks.

## Hierarchy

**FilteredHttpCollection**

## Implements

* [IFiltered](../interfaces/_filtering_collection_.ifiltered.md)

## Index

### Constructors

* [constructor](_filtering_collection_.filteredhttpcollection.md#constructor)

### Properties

* [ctx](_filtering_collection_.filteredhttpcollection.md#ctx)
* [matcher](_filtering_collection_.filteredhttpcollection.md#matcher)

### Methods

* [intercepted](_filtering_collection_.filteredhttpcollection.md#intercepted)
* [mocks](_filtering_collection_.filteredhttpcollection.md#mocks)
* [only](_filtering_collection_.filteredhttpcollection.md#only)
* [redact](_filtering_collection_.filteredhttpcollection.md#redact)
* [request](_filtering_collection_.filteredhttpcollection.md#request)
* [response](_filtering_collection_.filteredhttpcollection.md#response)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FilteredHttpCollection**(__namedParameters: *`object`*): [FilteredHttpCollection](_filtering_collection_.filteredhttpcollection.md)

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| context | [Context](_context_.context.md) |
| matcher |  `function` &#124; [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md)|

**Returns:** [FilteredHttpCollection](_filtering_collection_.filteredhttpcollection.md)

___

## Properties

<a id="ctx"></a>

### `<Private>` ctx

**● ctx**: *[Context](_context_.context.md)*

___
<a id="matcher"></a>

### `<Private>` matcher

**● matcher**: * [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](../modules/_filtering_matcher_.md#matchfn)
*

___

## Methods

<a id="intercepted"></a>

###  intercepted

▸ **intercepted**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

Return all intercepted requests matching the current filter

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="mocks"></a>

###  mocks

▸ **mocks**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

Return all intercepted mocks matching the current filter

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="only"></a>

### `<Private>` only

▸ **only**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

If the current filter only matches a single request, then return the single matching instance. Otherwise, throw an error.

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

___
<a id="redact"></a>

###  redact

▸ **redact**(property: * `string` &#124; `string`[]*, redactor?: *[Redactor](../modules/_filtering_redact_.md#redactor)*): `void`

Redact given property/properties on all intercepted requests matching current filter.

Useful whenever your HTTP requests contain sensitive details such as an API key that should not be saved to disc.

**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| property |  `string` &#124; `string`[]| - |  Nested path(s) for properties to redact from intercepted HTTP requests. Works for all properties on serialized HTTP request/response objects. Accepts dot notation for nested properties (eg \`response.body.foobars\[0\].id\`) |
| `Default value` redactor | [Redactor](../modules/_filtering_redact_.md#redactor) |  () &#x3D;&gt; DEFAULT_REDACT_SYMBOL |  Custom redactor. Defaults to replacing matching values with "**\***" |

**Returns:** `void`

___
<a id="request"></a>

###  request

▸ **request**(): [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)

Return serialized request part of the _single_ matching intercepted HTTP request.

Throws an exception if multiple requests were matched.

**Returns:** [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)

___
<a id="response"></a>

###  response

▸ **response**(): [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)

Return serialized response part of the _single_ matching intercepted HTTP request.

Throws an exception if multiple requests were matched.

**Returns:** [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)

___

