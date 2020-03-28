[yesno-http](../README.md) > ["recording"](../modules/_recording_.md) > [Recording](../classes/_recording_.recording.md)

# Class: Recording

Represents a single YesNo recording

## Hierarchy

**Recording**

## Index

### Constructors

* [constructor](_recording_.recording.md#constructor)

### Properties

* [options](_recording_.recording.md#options)

### Methods

* [complete](_recording_.recording.md#complete)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Recording**(options: *[IRecordingOptions](../interfaces/_recording_.irecordingoptions.md)*): [Recording](_recording_.recording.md)

**Parameters:**

| Name | Type |
| ------ | ------ |
| options | [IRecordingOptions](../interfaces/_recording_.irecordingoptions.md) |

**Returns:** [Recording](_recording_.recording.md)

___

## Properties

<a id="options"></a>

### `<Private>` options

**● options**: *[IRecordingOptions](../interfaces/_recording_.irecordingoptions.md)*

___

## Methods

<a id="complete"></a>

###  complete

▸ **complete**(): `Promise`< `string` &#124; `undefined`>

Complete recording by saving all HTTP requests to disc if in record mode. No-op otherwise.

**Returns:** `Promise`< `string` &#124; `undefined`>

___

