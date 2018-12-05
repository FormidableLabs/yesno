[yesno-http](../README.md) > ["filtering/redact"](../modules/_filtering_redact_.md)

# External module: "filtering/redact"

## Index

### Type aliases

* [Redactor](_filtering_redact_.md#redactor)

### Functions

* [defaultRedactor](_filtering_redact_.md#defaultredactor)
* [redact](_filtering_redact_.md#redact)

---

## Type aliases

<a id="redactor"></a>

###  Redactor

**Ƭ Redactor**: *`function`*

*Defined in [filtering/redact.ts:5](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/filtering/redact.ts#L5)*

#### Type declaration
▸(value: *`any`*, path: *`string`*): `string`

**Parameters:**

| Name | Type |
| ------ | ------ |
| value | `any` |
| path | `string` |

**Returns:** `string`

___

## Functions

<a id="defaultredactor"></a>

###  defaultRedactor

▸ **defaultRedactor**(): `string`

*Defined in [filtering/redact.ts:7](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/filtering/redact.ts#L7)*

**Returns:** `string`

___
<a id="redact"></a>

###  redact

▸ **redact**(record: *[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)*, properties: *`string`[]*, redactor?: *[Redactor](_filtering_redact_.md#redactor)*): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

*Defined in [filtering/redact.ts:19](https://github.com/FormidableLabs/yesno/blob/b6b210e/src/filtering/redact.ts#L19)*

Redact properties on the matching intercepted records.

Use a `.` to reference a nested property
*__todo__*: Benchmark & investigate alternatives

**Parameters:**

| Name | Type | Default value |
| ------ | ------ | ------ |
| record | [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md) | - |
| properties | `string`[] | - |
| `Default value` redactor | [Redactor](_filtering_redact_.md#redactor) |  defaultRedactor |

**Returns:** [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

___

