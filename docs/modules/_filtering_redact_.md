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

**Returns:** `string`

___
<a id="redact"></a>

###  redact

▸ **redact**(record: *[ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)*, properties: *`string`[]*, redactor?: *[Redactor](_filtering_redact_.md#redactor)*): [ISerializedHttp](../interfaces/_http_serializer_.iserializedhttp.md)

Redact properties on the matching intercepted records. Note that header names are forced to lower case.

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

