[yesno-http](../README.md) > ["interceptor"](../modules/_interceptor_.md) > [IInterceptOptions](../interfaces/_interceptor_.iinterceptoptions.md)

# Interface: IInterceptOptions

Configure intercept

## Hierarchy

**IInterceptOptions**

↳  [IYesNoInterceptingOptions](_yesno_.iyesnointerceptingoptions.md)

## Index

### Properties

* [ignorePorts](_interceptor_.iinterceptoptions.md#ignoreports)

---

## Properties

<a id="ignoreports"></a>

### `<Optional>` ignorePorts

**● ignorePorts**: *`number`[]*

Do not intercept outbound requests on these ports.

By default MITM will intercept activity on any socket, HTTP or otherwise. If you need to ignore a port (eg for a database connection), provide that port number here.

In practice YesNo normally runs after long running connections have been established, so this won't be a problem.

___

