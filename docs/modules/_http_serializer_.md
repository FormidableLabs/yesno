[yesno-http](../README.md) > ["http-serializer"](../modules/_http_serializer_.md)

# External module: "http-serializer"

## Index

### Classes

* [RequestSerializer](../classes/_http_serializer_.requestserializer.md)
* [ResponseSerializer](../classes/_http_serializer_.responseserializer.md)

### Interfaces

* [ClientRequestFull](../interfaces/_http_serializer_.clientrequestfull.md)
* [ICreateRecord](../interfaces/_http_serializer_.icreaterecord.md)
* [IHeaders](../interfaces/_http_serializer_.iheaders.md)
* [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)
* [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)
* [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)

### Variables

* [Headers](_http_serializer_.md#headers)
* [SCHEMA_VERSION](_http_serializer_.md#schema_version)
* [SerializedHttp](_http_serializer_.md#serializedhttp)
* [SerializedHttpOptional](_http_serializer_.md#serializedhttpoptional)
* [SerializedRequest](_http_serializer_.md#serializedrequest)
* [SerializedRequestOptional](_http_serializer_.md#serializedrequestoptional)
* [SerializedResponse](_http_serializer_.md#serializedresponse)
* [debug](_http_serializer_.md#debug)

### Functions

* [createRecord](_http_serializer_.md#createrecord)
* [formatUrl](_http_serializer_.md#formaturl)
* [serializeJSON](_http_serializer_.md#serializejson)
* [validateSerializedHttpArray](_http_serializer_.md#validateserializedhttparray)

---

## Variables

<a id="headers"></a>

### `<Const>` Headers

**● Headers**: *`DictionaryType`<`StringType`, `UnionType`<( `NumberType` &#124; `StringType` &#124; `ArrayType`<`StringType`, `string`[], `string`[], `unknown`> &#124; `UndefinedType`)[],  `undefined` &#124; `string` &#124; `number` &#124; `string`[],  `undefined` &#124; `string` &#124; `number` &#124; `string`[], `unknown`>, `object`, `object`, `unknown`>* =  t.dictionary(
  t.string,
  t.union([t.number, t.string, t.array(t.string), t.undefined]),
)

___
<a id="schema_version"></a>

### `<Const>` SCHEMA_VERSION

**● SCHEMA_VERSION**: *"1.0.0"* = "1.0.0"

___
<a id="serializedhttp"></a>

### `<Const>` SerializedHttp

**● SerializedHttp**: *`IntersectionType`<`Object`,  `object` & `object`,  `object` & `object`, `unknown`>* =  t.intersection([
  SerializedHttpOptional,
  t.interface({
    __id: t.readonly(t.string),
    __version: t.readonly(t.string),
    request: SerializedRequest,
    response: SerializedResponse,
  }),
])

___
<a id="serializedhttpoptional"></a>

### `<Const>` SerializedHttpOptional

**● SerializedHttpOptional**: *`PartialType`<`object`, `object`, `object`, `unknown`>* =  t.partial({
  __duration: t.readonly(t.number), // Optional
  __timestamp: t.readonly(t.number), // Optional
})

___
<a id="serializedrequest"></a>

### `<Const>` SerializedRequest

**● SerializedRequest**: *`IntersectionType`<`Object`,  `object` & `object`,  `object` & `object`, `unknown`>* =  t.intersection([
  t.interface({
    headers: t.readonly(Headers),
    host: t.readonly(t.string),
    method: t.readonly(t.string),
    path: t.readonly(t.string),
    port: t.readonly(t.Integer),
    protocol: t.readonly(t.union([t.literal('http'), t.literal('https')])),
  }),
  SerializedRequestOptional,
])

___
<a id="serializedrequestoptional"></a>

### `<Const>` SerializedRequestOptional

**● SerializedRequestOptional**: *`PartialType`<`object`, `object`, `object`, `unknown`>* =  t.partial({
  body: t.readonly(t.union([t.string, t.object])), // Optional
  query: t.readonly(t.string), // Optional
})

___
<a id="serializedresponse"></a>

### `<Const>` SerializedResponse

**● SerializedResponse**: *`InterfaceType`<`object`, `object`, `object`, `unknown`>* =  t.interface({
  body: t.readonly(t.union([t.string, t.object])),
  headers: t.readonly(Headers),
  statusCode: t.readonly(t.Integer),
})

___
<a id="debug"></a>

### `<Const>` debug

**● debug**: *`any`* =  require('debug')('yesno:http-serializer')

___

## Functions

<a id="createrecord"></a>

###  createRecord

▸ **createRecord**(__namedParameters: *`object`*): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| duration | `number` |
| request | [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md) |
| response | [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md) |

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

___
<a id="formaturl"></a>

###  formatUrl

▸ **formatUrl**(request: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*, includePort?: *`boolean`*): `string`

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| request | [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md) | - |
| `Default value` includePort | `boolean` | false |

**Returns:** `string`

___
<a id="serializejson"></a>

###  serializeJSON

▸ **serializeJSON**(headers: *[IHeaders](../interfaces/_http_serializer_.iheaders.md)*, body?: * `undefined` &#124; `string`*):  `undefined` &#124; `string` &#124; `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| headers | [IHeaders](../interfaces/_http_serializer_.iheaders.md) |
| `Optional` body |  `undefined` &#124; `string`|

**Returns:**  `undefined` &#124; `string` &#124; `any`

___
<a id="validateserializedhttparray"></a>

###  validateSerializedHttpArray

▸ **validateSerializedHttpArray**(records: *`any`[]*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| records | `any`[] |

**Returns:** `void`

___

