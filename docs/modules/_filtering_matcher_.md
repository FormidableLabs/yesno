[yesno-http](../README.md) > ["filtering/matcher"](../modules/_filtering_matcher_.md)

# External module: "filtering/matcher"

## Index

### Interfaces

* [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md)
* [ISerializedRequestResponseToMatch](../interfaces/_filtering_matcher_.iserializedrequestresponsetomatch.md)

### Type aliases

* [MatchFn](_filtering_matcher_.md#matchfn)
* [Matcher](_filtering_matcher_.md#matcher)
* [RequestQuery](_filtering_matcher_.md#requestquery)
* [ResponseQuery](_filtering_matcher_.md#responsequery)
* [UnsafeMatchFn](_filtering_matcher_.md#unsafematchfn)

### Functions

* [match](_filtering_matcher_.md#match)

### Object literals

* [EMPTY_RESPONSE](_filtering_matcher_.md#empty_response)

---

## Type aliases

<a id="matchfn"></a>

###  MatchFn

**Ƭ MatchFn**: *`function`*

#### Type declaration
▸(serialized: *[ISerializedRequestResponse](../interfaces/_http_serializer_.iserializedrequestresponse.md)*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| serialized | [ISerializedRequestResponse](../interfaces/_http_serializer_.iserializedrequestresponse.md) |

**Returns:** `boolean`

___
<a id="matcher"></a>

###  Matcher

**Ƭ Matcher**: * [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](_filtering_matcher_.md#matchfn)
*

___
<a id="requestquery"></a>

###  RequestQuery

**Ƭ RequestQuery**: *`object`*

#### Type declaration

___
<a id="responsequery"></a>

###  ResponseQuery

**Ƭ ResponseQuery**: *`object`*

#### Type declaration

___
<a id="unsafematchfn"></a>

###  UnsafeMatchFn

**Ƭ UnsafeMatchFn**: *`function`*

#### Type declaration
▸(serialized: *[ISerializedRequestResponseToMatch](../interfaces/_filtering_matcher_.iserializedrequestresponsetomatch.md)*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| serialized | [ISerializedRequestResponseToMatch](../interfaces/_filtering_matcher_.iserializedrequestresponsetomatch.md) |

**Returns:** `boolean`

___

## Functions

<a id="match"></a>

###  match

▸ **match**(fnOrPartialMatch: * [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](_filtering_matcher_.md#matchfn)*): [UnsafeMatchFn](_filtering_matcher_.md#unsafematchfn)

Curried function to determine whether a query matches an intercepted request.

Query objects must be a deep partial match against the intercepted request.

RegEx values are tested for match.

**Parameters:**

| Name | Type |
| ------ | ------ |
| fnOrPartialMatch |  [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](_filtering_matcher_.md#matchfn)|

**Returns:** [UnsafeMatchFn](_filtering_matcher_.md#unsafematchfn)

___

## Object literals

<a id="empty_response"></a>

### `<Const>` EMPTY_RESPONSE

**EMPTY_RESPONSE**: *`object`*

<a id="empty_response.body"></a>

####  body

**● body**: *`object`*

#### Type declaration

___
<a id="empty_response.headers"></a>

####  headers

**● headers**: *`object`*

#### Type declaration

___
<a id="empty_response.statuscode"></a>

####  statusCode

**● statusCode**: *`number`* = 0

___

___

