[yesno-http](../README.md) > ["filtering/collection"](../modules/_filtering_collection_.md) > [FilteredHttpCollection](../classes/_filtering_collection_.filteredhttpcollection.md)

# Class: FilteredHttpCollection

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

*Defined in [filtering/collection.ts:28](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L28)*

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

*Defined in [filtering/collection.ts:27](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L27)*

___
<a id="matcher"></a>

### `<Private>` matcher

**● matcher**: * [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](../modules/_filtering_matcher_.md#matchfn)
*

*Defined in [filtering/collection.ts:28](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L28)*

___

## Methods

<a id="intercepted"></a>

###  intercepted

▸ **intercepted**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

*Defined in [filtering/collection.ts:35](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L35)*

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="mocks"></a>

###  mocks

▸ **mocks**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

*Defined in [filtering/collection.ts:39](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L39)*

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="only"></a>

### `<Private>` only

▸ **only**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

*Defined in [filtering/collection.ts:79](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L79)*

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

___
<a id="redact"></a>

###  redact

▸ **redact**(property: * `string` &#124; `string`[]*, redactor?: *[Redactor](../modules/_filtering_redact_.md#redactor)*): `void`

*Defined in [filtering/collection.ts:43](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L43)*

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| property |  `string` &#124; `string`[]| - |
| `Default value` redactor | [Redactor](../modules/_filtering_redact_.md#redactor) |  () &#x3D;&gt; DEFAULT_REDACT_SYMBOL |

**Returns:** `void`

___
<a id="request"></a>

###  request

▸ **request**(): [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)

*Defined in [filtering/collection.ts:66](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L66)*

Return serialized request part of the _single_ matching intercepted HTTP request.

Throws an exception is multiple requests were matched.

**Returns:** [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)

___
<a id="response"></a>

###  response

▸ **response**(): [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)

*Defined in [filtering/collection.ts:75](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/collection.ts#L75)*

Return serialized response part of the _single_ matching intercepted HTTP request.

Throws an exception is multiple requests were matched.

**Returns:** [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)

___

