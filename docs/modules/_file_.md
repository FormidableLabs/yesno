[yesno-http](../README.md) > ["file"](../modules/_file_.md)

# External module: "file"

## Index

### Interfaces

* [IFileOptions](../interfaces/_file_.ifileoptions.md)
* [IHttpMock](../interfaces/_file_.ihttpmock.md)
* [IPartialMockRequest](../interfaces/_file_.ipartialmockrequest.md)
* [IPartialMockResponse](../interfaces/_file_.ipartialmockresponse.md)
* [ISaveFile](../interfaces/_file_.isavefile.md)
* [ISaveOptions](../interfaces/_file_.isaveoptions.md)

### Variables

* [debug](_file_.md#debug)

### Functions

* [getMockFilename](_file_.md#getmockfilename)
* [helpMessageMissingMock](_file_.md#helpmessagemissingmock)
* [hydrateHttpMock](_file_.md#hydratehttpmock)
* [load](_file_.md#load)
* [save](_file_.md#save)

---

## Variables

<a id="debug"></a>

### `<Const>` debug

**● debug**: *`IDebugger`* =  require('debug')('yesno:mocks')

*Defined in [file.ts:10](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/file.ts#L10)*

___

## Functions

<a id="getmockfilename"></a>

###  getMockFilename

▸ **getMockFilename**(name: *`string`*, dir: *`string`*): `string`

*Defined in [file.ts:134](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/file.ts#L134)*

Get the generated filename for a mock name.

**Parameters:**

| Name | Type |
| ------ | ------ |
| name | `string` |
| dir | `string` |

**Returns:** `string`

___
<a id="helpmessagemissingmock"></a>

###  helpMessageMissingMock

▸ **helpMessageMissingMock**(filename: *`string`*): `string`

*Defined in [file.ts:98](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/file.ts#L98)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| filename | `string` |

**Returns:** `string`

___
<a id="hydratehttpmock"></a>

###  hydrateHttpMock

▸ **hydrateHttpMock**(mock: *[IHttpMock](../interfaces/_file_.ihttpmock.md)*): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

*Defined in [file.ts:104](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/file.ts#L104)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| mock | [IHttpMock](../interfaces/_file_.ihttpmock.md) |

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

___
<a id="load"></a>

###  load

▸ **load**(__namedParameters: *`object`*): `Promise`<[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]>

*Defined in [file.ts:45](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/file.ts#L45)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| filename | `string` |

**Returns:** `Promise`<[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]>

___
<a id="save"></a>

###  save

▸ **save**(__namedParameters: *`object`*): `Promise`<`string`>

*Defined in [file.ts:80](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/file.ts#L80)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type | Default value |
| ------ | ------ | ------ |
| filename | `string` | - |
| records | [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[] |  [] |

**Returns:** `Promise`<`string`>

___

