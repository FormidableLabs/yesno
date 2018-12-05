[yesno-http](../README.md) > ["filtering/comparator"](../modules/_filtering_comparator_.md)

# External module: "filtering/comparator"

## Index

### Interfaces

* [IComparatorMetadata](../interfaces/_filtering_comparator_.icomparatormetadata.md)

### Type aliases

* [ComparatorFn](_filtering_comparator_.md#comparatorfn)

### Functions

* [assertEqual](_filtering_comparator_.md#assertequal)
* [byUrl](_filtering_comparator_.md#byurl)

---

## Type aliases

<a id="comparatorfn"></a>

###  ComparatorFn

**Ƭ ComparatorFn**: *`function`*

*Defined in [filtering/comparator.ts:9](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/comparator.ts#L9)*

#### Type declaration
▸(intercepted: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*, mock: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*, metadata: *[IComparatorMetadata](../interfaces/_filtering_comparator_.icomparatormetadata.md)*): `boolean`

**Parameters:**

| Name | Type |
| ------ | ------ |
| intercepted | [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md) |
| mock | [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md) |
| metadata | [IComparatorMetadata](../interfaces/_filtering_comparator_.icomparatormetadata.md) |

**Returns:** `boolean`

___

## Functions

<a id="assertequal"></a>

###  assertEqual

▸ **assertEqual**<`T`>(unknown: *`T`*, known: *`T`*, message: *`string`*): `void`

*Defined in [filtering/comparator.ts:66](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/comparator.ts#L66)*

**Type parameters:**

#### T 
**Parameters:**

| Name | Type |
| ------ | ------ |
| unknown | `T` |
| known | `T` |
| message | `string` |

**Returns:** `void`

___
<a id="byurl"></a>

### `<Const>` byUrl

▸ **byUrl**(interceptedRequest: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*, mockRequest: *[ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)*, __namedParameters: *`object`*): `boolean`

*Defined in [filtering/comparator.ts:17](https://github.com/FormidableLabs/yesno/blob/acc9f7a/src/filtering/comparator.ts#L17)*

**Parameters:**

**interceptedRequest: [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)**

**mockRequest: [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| requestIndex | `number` |

**Returns:** `boolean`

___

