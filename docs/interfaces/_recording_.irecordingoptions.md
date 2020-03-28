[yesno-http](../README.md) > ["recording"](../modules/_recording_.md) > [IRecordingOptions](../interfaces/_recording_.irecordingoptions.md)

# Interface: IRecordingOptions

## Hierarchy

 [IFileOptions](_file_.ifileoptions.md)

**↳ IRecordingOptions**

## Index

### Properties

* [filename](_recording_.irecordingoptions.md#filename)
* [getRecordsToSave](_recording_.irecordingoptions.md#getrecordstosave)
* [mode](_recording_.irecordingoptions.md#mode)

---

## Properties

<a id="filename"></a>

###  filename

**● filename**: *`string`*

___
<a id="getrecordstosave"></a>

###  getRecordsToSave

**● getRecordsToSave**: *`function`*

Get all recorded HTTP requests we need to save to disc

#### Type declaration
▸(): [ISerializedHttp](_http_serializer_.iserializedhttp.md)[]

**Returns:** [ISerializedHttp](_http_serializer_.iserializedhttp.md)[]

___
<a id="mode"></a>

###  mode

**● mode**: *[RecordMode](../enums/_recording_.recordmode.md)*

Current record mode. Determines whether or not we'll save to disc on completion.

___

