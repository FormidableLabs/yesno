[yesno-http](../README.md) > ["yesno"](../modules/_yesno_.md) > [YesNo](../classes/_yesno_.yesno.md)

# Class: YesNo

## Hierarchy

**YesNo**

## Implements

* [IFiltered](../interfaces/_filtering_collection_.ifiltered.md)

## Index

### Constructors

* [constructor](_yesno_.yesno.md#constructor)

### Properties

* [ctx](_yesno_.yesno.md#ctx)
* [interceptor](_yesno_.yesno.md#interceptor)
* [mode](_yesno_.yesno.md#mode)

### Methods

* [clear](_yesno_.yesno.md#clear)
* [createInterceptor](_yesno_.yesno.md#createinterceptor)
* [enable](_yesno_.yesno.md#enable)
* [getCollection](_yesno_.yesno.md#getcollection)
* [getModeByEnv](_yesno_.yesno.md#getmodebyenv)
* [getRecordsToSave](_yesno_.yesno.md#getrecordstosave)
* [intercepted](_yesno_.yesno.md#intercepted)
* [isMode](_yesno_.yesno.md#ismode)
* [load](_yesno_.yesno.md#load)
* [matching](_yesno_.yesno.md#matching)
* [mock](_yesno_.yesno.md#mock)
* [mockResponse](_yesno_.yesno.md#mockresponse)
* [mocks](_yesno_.yesno.md#mocks)
* [recordCompleted](_yesno_.yesno.md#recordcompleted)
* [recording](_yesno_.yesno.md#recording)
* [redact](_yesno_.yesno.md#redact)
* [restore](_yesno_.yesno.md#restore)
* [save](_yesno_.yesno.md#save)
* [setMocks](_yesno_.yesno.md#setmocks)
* [setMode](_yesno_.yesno.md#setmode)
* [spy](_yesno_.yesno.md#spy)
* [test](_yesno_.yesno.md#test)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new YesNo**(ctx: *[Context](_context_.context.md)*): [YesNo](_yesno_.yesno.md)

*Defined in [yesno.ts:40](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L40)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| ctx | [Context](_context_.context.md) |

**Returns:** [YesNo](_yesno_.yesno.md)

___

## Properties

<a id="ctx"></a>

### `<Private>` ctx

**● ctx**: *[Context](_context_.context.md)*

*Defined in [yesno.ts:40](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L40)*

___
<a id="interceptor"></a>

### `<Private>` interceptor

**● interceptor**: *[Interceptor](_interceptor_.interceptor.md)*

*Defined in [yesno.ts:39](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L39)*

___
<a id="mode"></a>

### `<Private>` mode

**● mode**: *`Mode`* =  Mode.Spy

*Defined in [yesno.ts:38](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L38)*

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `void`

*Defined in [yesno.ts:147](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L147)*

Clear all stateful information about requests.

If used in a test suite, this should be called after each test.

**Returns:** `void`

___
<a id="createinterceptor"></a>

### `<Private>` createInterceptor

▸ **createInterceptor**(): [Interceptor](_interceptor_.interceptor.md)

*Defined in [yesno.ts:241](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L241)*

**Returns:** [Interceptor](_interceptor_.interceptor.md)

___
<a id="enable"></a>

### `<Private>` enable

▸ **enable**(options?: *[IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md)*): [YesNo](_yesno_.yesno.md)

*Defined in [yesno.ts:220](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L220)*

Enable intercepting requests

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options | [IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md) |

**Returns:** [YesNo](_yesno_.yesno.md)

___
<a id="getcollection"></a>

### `<Private>` getCollection

▸ **getCollection**(matcher?: * [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](../modules/_filtering_matcher_.md#matchfn)*): [FilteredHttpCollection](_filtering_collection_.filteredhttpcollection.md)

*Defined in [yesno.ts:276](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L276)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` matcher |  [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](../modules/_filtering_matcher_.md#matchfn)|

**Returns:** [FilteredHttpCollection](_filtering_collection_.filteredhttpcollection.md)

___
<a id="getmodebyenv"></a>

### `<Private>` getModeByEnv

▸ **getModeByEnv**(): `Mode`

*Defined in [yesno.ts:185](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L185)*

**Returns:** `Mode`

___
<a id="getrecordstosave"></a>

### `<Private>` getRecordsToSave

▸ **getRecordsToSave**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

*Defined in [yesno.ts:200](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L200)*

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="intercepted"></a>

###  intercepted

▸ **intercepted**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

*Defined in [yesno.ts:167](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L167)*

Get all intercepted requests

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="ismode"></a>

### `<Private>` isMode

▸ **isMode**(mode: *`Mode`*): `boolean`

*Defined in [yesno.ts:237](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L237)*

Determine the current mode

**Parameters:**

| Name | Type |
| ------ | ------ |
| mode | `Mode` |

**Returns:** `boolean`

___
<a id="load"></a>

###  load

▸ **load**(options: *[IFileOptions](../interfaces/_file_.ifileoptions.md)*): `Promise`<[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]>

*Defined in [yesno.ts:123](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L123)*

Load request/response mocks from disk

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [IFileOptions](../interfaces/_file_.ifileoptions.md) |

**Returns:** `Promise`<[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]>

___
<a id="matching"></a>

###  matching

▸ **matching**(filter?: *[HttpFilter](../modules/_yesno_.md#httpfilter)*): [FilteredHttpCollection](_filtering_collection_.filteredhttpcollection.md)

*Defined in [yesno.ts:157](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L157)*

Create a filter collection
*__todo__*: Convert everything to a match fn

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` filter | [HttpFilter](../modules/_yesno_.md#httpfilter) |

**Returns:** [FilteredHttpCollection](_filtering_collection_.filteredhttpcollection.md)

___
<a id="mock"></a>

###  mock

▸ **mock**(mocks: *[IHttpMock](../interfaces/_file_.ihttpmock.md)[]*, options?: *[IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md)*): `void`

*Defined in [yesno.ts:68](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L68)*

Mock responses for intercepted requests
*__todo__*: Reset the request counter?

**Parameters:**

| Name | Type |
| ------ | ------ |
| mocks | [IHttpMock](../interfaces/_file_.ihttpmock.md)[] |
| `Optional` options | [IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md) |

**Returns:** `void`

___
<a id="mockresponse"></a>

### `<Private>` mockResponse

▸ **mockResponse**(__namedParameters: *`object`*): `Promise`<`void`>

*Defined in [yesno.ts:285](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L285)*

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| clientRequest | `ClientRequest` |
| interceptedRequest | `IncomingMessage` |
| interceptedResponse | `ServerResponse` |
| requestNumber | `number` |
| requestSerializer | [RequestSerializer](_http_serializer_.requestserializer.md) |

**Returns:** `Promise`<`void`>

___
<a id="mocks"></a>

###  mocks

▸ **mocks**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

*Defined in [yesno.ts:174](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L174)*

Get all loaded mocks

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="recordcompleted"></a>

### `<Private>` recordCompleted

▸ **recordCompleted**(request: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*, response: *[ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)*, requestNumber: *`number`*): `void`

*Defined in [yesno.ts:327](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L327)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| request | [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md) |
| response | [ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md) |
| requestNumber | `number` |

**Returns:** `void`

___
<a id="recording"></a>

###  recording

▸ **recording**(options: *[IFileOptions](../interfaces/_file_.ifileoptions.md)*): `Promise`<[Recording](_recording_.recording.md)>

*Defined in [yesno.ts:75](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L75)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [IFileOptions](../interfaces/_file_.ifileoptions.md) |

**Returns:** `Promise`<[Recording](_recording_.recording.md)>

___
<a id="redact"></a>

###  redact

▸ **redact**(property: * `string` &#124; `string`[]*, redactor?: *[Redactor](../modules/_filtering_redact_.md#redactor)*): `void`

*Defined in [yesno.ts:181](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L181)*

Redact property on all records

**Parameters:**

| Name | Type |
| ------ | ------ |
| property |  `string` &#124; `string`[]|
| `Optional` redactor | [Redactor](../modules/_filtering_redact_.md#redactor) |

**Returns:** `void`

___
<a id="restore"></a>

###  restore

▸ **restore**(): `void`

*Defined in [yesno.ts:50](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L50)*

Restore HTTP functionality

**Returns:** `void`

___
<a id="save"></a>

###  save

▸ **save**(options: * [ISaveOptions](../interfaces/_file_.isaveoptions.md) & [IFileOptions](../interfaces/_file_.ifileoptions.md)*): `Promise`< `string` &#124; `void`>

*Defined in [yesno.ts:136](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L136)*

Save intercepted requests

**Parameters:**

| Name | Type |
| ------ | ------ |
| options |  [ISaveOptions](../interfaces/_file_.isaveoptions.md) & [IFileOptions](../interfaces/_file_.ifileoptions.md)|

**Returns:** `Promise`< `string` &#124; `void`>
Full filename of saved JSON if generated

___
<a id="setmocks"></a>

### `<Private>` setMocks

▸ **setMocks**(mocks: *[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]*): `void`

*Defined in [yesno.ts:229](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L229)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| mocks | [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[] |

**Returns:** `void`

___
<a id="setmode"></a>

### `<Private>` setMode

▸ **setMode**(mode: *`Mode`*): `void`

*Defined in [yesno.ts:268](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L268)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| mode | `Mode` |

**Returns:** `void`

___
<a id="spy"></a>

###  spy

▸ **spy**(options?: *[IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md)*): `void`

*Defined in [yesno.ts:59](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L59)*

Spy on intercepted requests

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options | [IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md) |

**Returns:** `void`

___
<a id="test"></a>

###  test

▸ **test**(__namedParameters: *`object`*): [GenericTestFunction](../modules/_yesno_.md#generictestfunction)

*Defined in [yesno.ts:94](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/yesno.ts#L94)*

Create a test function that will wrap its provided test in a recording.

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| dir | `string` |
| it |  `undefined` &#124; `function`|
| prefix |  `undefined` &#124; `string`|
| test |  `undefined` &#124; `function`|

**Returns:** [GenericTestFunction](../modules/_yesno_.md#generictestfunction)

___

