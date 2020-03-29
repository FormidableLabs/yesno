[yesno-http](../README.md) > ["yesno"](../modules/_yesno_.md) > [YesNo](../classes/_yesno_.yesno.md)

# Class: YesNo

Client API for YesNo

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
* [mocks](_yesno_.yesno.md#mocks)
* [onIntercept](_yesno_.yesno.md#onintercept)
* [onProxied](_yesno_.yesno.md#onproxied)
* [recordRequest](_yesno_.yesno.md#recordrequest)
* [recordResponse](_yesno_.yesno.md#recordresponse)
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

___
<a id="interceptor"></a>

### `<Private>` interceptor

**● interceptor**: *[Interceptor](_interceptor_.interceptor.md)*

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `void`

Clear all stateful information about requests.

If used in a test suite, this should be called after each test.

**Returns:** `void`

___
<a id="createinterceptor"></a>

### `<Private>` createInterceptor

▸ **createInterceptor**(): [Interceptor](_interceptor_.interceptor.md)

**Returns:** [Interceptor](_interceptor_.interceptor.md)

___
<a id="enable"></a>

### `<Private>` enable

▸ **enable**(options?: *[IYesNoInterceptingOptions](../interfaces/_yesno_.iyesnointerceptingoptions.md)*): [YesNo](_yesno_.yesno.md)

Enable intercepting requests

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options | [IYesNoInterceptingOptions](../interfaces/_yesno_.iyesnointerceptingoptions.md) |

**Returns:** [YesNo](_yesno_.yesno.md)

___
<a id="getcollection"></a>

### `<Private>` getCollection

▸ **getCollection**(matcher?: * [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](../modules/_filtering_matcher_.md#matchfn)*): [FilteredHttpCollection](_filtering_collection_.filteredhttpcollection.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` matcher |  [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](../modules/_filtering_matcher_.md#matchfn)|

**Returns:** [FilteredHttpCollection](_filtering_collection_.filteredhttpcollection.md)

___
<a id="getmodebyenv"></a>

### `<Private>` getModeByEnv

▸ **getModeByEnv**(): `Mode`

**Returns:** `Mode`

___
<a id="getrecordstosave"></a>

### `<Private>` getRecordsToSave

▸ **getRecordsToSave**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="intercepted"></a>

###  intercepted

▸ **intercepted**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

Get all intercepted requests

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="ismode"></a>

### `<Private>` isMode

▸ **isMode**(mode: *`Mode`*): `boolean`

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

▸ **mock**(mocks: *[IHttpMock](../interfaces/_file_.ihttpmock.md)[]*, options?: *[IYesNoInterceptingOptions](../interfaces/_yesno_.iyesnointerceptingoptions.md)*): `void`

Mock responses for intercepted requests
*__todo__*: Reset the request counter?

**Parameters:**

| Name | Type |
| ------ | ------ |
| mocks | [IHttpMock](../interfaces/_file_.ihttpmock.md)[] |
| `Optional` options | [IYesNoInterceptingOptions](../interfaces/_yesno_.iyesnointerceptingoptions.md) |

**Returns:** `void`

___
<a id="mocks"></a>

###  mocks

▸ **mocks**(): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

Get all loaded mocks

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[]

___
<a id="onintercept"></a>

### `<Private>` onIntercept

▸ **onIntercept**(event: *[IInterceptEvent](../interfaces/_interceptor_.iinterceptevent.md)*): `Promise`<`void`>

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | [IInterceptEvent](../interfaces/_interceptor_.iinterceptevent.md) |

**Returns:** `Promise`<`void`>

___
<a id="onproxied"></a>

### `<Private>` onProxied

▸ **onProxied**(__namedParameters: *`object`*): `void`

**Parameters:**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| requestNumber | `number` |
| requestSerializer | [RequestSerializer](_http_serializer_.requestserializer.md) |
| responseSerializer | [ResponseSerializer](_http_serializer_.responseserializer.md) |

**Returns:** `void`

___
<a id="recordrequest"></a>

### `<Private>` recordRequest

▸ **recordRequest**(requestSerializer: *[RequestSerializer](_http_serializer_.requestserializer.md)*, requestNumber: *`number`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| requestSerializer | [RequestSerializer](_http_serializer_.requestserializer.md) |
| requestNumber | `number` |

**Returns:** `void`

___
<a id="recordresponse"></a>

### `<Private>` recordResponse

▸ **recordResponse**(request: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*, response: *[ISerializedResponse](../interfaces/_http_serializer_.iserializedresponse.md)*, requestNumber: *`number`*): `void`

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

Start a new recording.

Depending on the configured mode, will either spy on all outbound HTTP requests or return mocks loaded from disc.

When done, call the `complete()` on the returned recording to save all intercepted requests to disc if applicable.

**Parameters:**

| Name | Type | Description |
| ------ | ------ | ------ |
| options | [IFileOptions](../interfaces/_file_.ifileoptions.md) |  Where to load/save mocks |

**Returns:** `Promise`<[Recording](_recording_.recording.md)>
A new recording.

___
<a id="redact"></a>

###  redact

▸ **redact**(property: * `string` &#124; `string`[]*, redactor?: *[Redactor](../modules/_filtering_redact_.md#redactor)*): `void`

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

Restore HTTP functionality

**Returns:** `void`

___
<a id="save"></a>

###  save

▸ **save**(options: * [ISaveOptions](../interfaces/_file_.isaveoptions.md) & [IFileOptions](../interfaces/_file_.ifileoptions.md)*): `Promise`< `string` &#124; `void`>

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

**Parameters:**

| Name | Type |
| ------ | ------ |
| mocks | [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)[] |

**Returns:** `void`

___
<a id="setmode"></a>

### `<Private>` setMode

▸ **setMode**(mode: *`Mode`*): `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| mode | `Mode` |

**Returns:** `void`

___
<a id="spy"></a>

###  spy

▸ **spy**(options?: *[IYesNoInterceptingOptions](../interfaces/_yesno_.iyesnointerceptingoptions.md)*): `void`

Spy on intercepted requests

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Optional` options | [IYesNoInterceptingOptions](../interfaces/_yesno_.iyesnointerceptingoptions.md) |

**Returns:** `void`

___
<a id="test"></a>

###  test

▸ **test**(__namedParameters: *`object`*): [GenericTestFunction](../modules/_yesno_.md#generictestfunction)

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

