[yesno-http](../README.md) > ["interceptor"](../modules/_interceptor_.md) > [IInterceptEvent](../interfaces/_interceptor_.iinterceptevent.md)

# Interface: IInterceptEvent

Event emitted whenever we intercept an HTTP request

## Hierarchy

**IInterceptEvent**

## Index

### Properties

* [clientRequest](_interceptor_.iinterceptevent.md#clientrequest)
* [interceptedRequest](_interceptor_.iinterceptevent.md#interceptedrequest)
* [interceptedResponse](_interceptor_.iinterceptevent.md#interceptedresponse)
* [proxy](_interceptor_.iinterceptevent.md#proxy)
* [requestNumber](_interceptor_.iinterceptevent.md#requestnumber)
* [requestSerializer](_interceptor_.iinterceptevent.md#requestserializer)

---

## Properties

<a id="clientrequest"></a>

###  clientRequest

**● clientRequest**: *`ClientRequest`*

The client request which initiated the HTTP request

___
<a id="interceptedrequest"></a>

###  interceptedRequest

**● interceptedRequest**: *`IncomingMessage`*

Request arriving to our MITM proxy

___
<a id="interceptedresponse"></a>

###  interceptedResponse

**● interceptedResponse**: *`ServerResponse`*

Response from our MITM proxy

___
<a id="proxy"></a>

###  proxy

**● proxy**: *`function`*

Proxy the intercepted request to its original destination

#### Type declaration
▸(): `void`

**Returns:** `void`

___
<a id="requestnumber"></a>

###  requestNumber

**● requestNumber**: *`number`*

___
<a id="requestserializer"></a>

###  requestSerializer

**● requestSerializer**: *[RequestSerializer](../classes/_http_serializer_.requestserializer.md)*

___

