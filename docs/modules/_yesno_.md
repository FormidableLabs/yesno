[yesno-http](../README.md) > ["yesno"](../modules/_yesno_.md)

# External module: "yesno"

## Index

### Classes

* [YesNo](../classes/_yesno_.yesno.md)

### Interfaces

* [IRecordableTest](../interfaces/_yesno_.irecordabletest.md)

### Type aliases

* [GenericTest](_yesno_.md#generictest)
* [GenericTestFunction](_yesno_.md#generictestfunction)
* [HttpFilter](_yesno_.md#httpfilter)

### Variables

* [debug](_yesno_.md#debug)

---

## Type aliases

<a id="generictest"></a>

###  GenericTest

**Ƭ GenericTest**: *`function`*

#### Type declaration
▸(...args: *`any`*):  `Promise`<`any`> &#124; `void`

**Parameters:**

| Name | Type |
| ------ | ------ |
| `Rest` args | `any` |

**Returns:**  `Promise`<`any`> &#124; `void`

___
<a id="generictestfunction"></a>

###  GenericTestFunction

**Ƭ GenericTestFunction**: *`function`*

#### Type declaration
▸(title: *`string`*, fn: *[GenericTest](_yesno_.md#generictest)*): `any`

**Parameters:**

| Name | Type |
| ------ | ------ |
| title | `string` |
| fn | [GenericTest](_yesno_.md#generictest) |

**Returns:** `any`

___
<a id="httpfilter"></a>

###  HttpFilter

**Ƭ HttpFilter**: * `string` &#124; `RegExp` &#124; [ISerializedHttpPartialDeepMatch](../interfaces/_filtering_matcher_.iserializedhttppartialdeepmatch.md) &#124; [MatchFn](_filtering_matcher_.md#matchfn)
*

___

## Variables

<a id="debug"></a>

### `<Const>` debug

**● debug**: *`IDebugger`* =  require('debug')('yesno')

___

