[yesno-http](../README.md) > ["yesno"](../modules/_yesno_.md) > [IYesNoInterceptingOptions](../interfaces/_yesno_.iyesnointerceptingoptions.md)

# Interface: IYesNoInterceptingOptions

Options to configure intercept of HTTP requests

## Hierarchy

 [IInterceptOptions](_interceptor_.iinterceptoptions.md)

**↳ IYesNoInterceptingOptions**

## Index

### Properties

* [comparatorFn](_yesno_.iyesnointerceptingoptions.md#comparatorfn)
* [ignorePorts](_yesno_.iyesnointerceptingoptions.md#ignoreports)

---

## Properties

<a id="comparatorfn"></a>

### `<Optional>` comparatorFn

**● comparatorFn**: *[ComparatorFn](../modules/_filtering_comparator_.md#comparatorfn)*

Comparator function used to determine whether an intercepted request matches a loaded mock.

___
<a id="ignoreports"></a>

### `<Optional>` ignorePorts

**● ignorePorts**: *`number`[]*

Do not intercept outbound requests on these ports.

By default MITM will intercept activity on any socket, HTTP or otherwise. If you need to ignore a port (eg for a database connection), provide that port number here.

In practice YesNo normally runs after long running connections have been established, so this won't be a problem.

___

