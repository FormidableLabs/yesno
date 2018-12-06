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

**Parameters:**

**interceptedRequest: [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)**

**mockRequest: [ISerializedRequest](../interfaces/_http_serializer_.iserializedrequest.md)**

**__namedParameters: `object`**

| Name | Type |
| ------ | ------ |
| requestIndex | `number` |

**Returns:** `boolean`

___

