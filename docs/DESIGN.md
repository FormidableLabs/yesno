# YesNo Design

This document is meant to describe the guiding principles and direction of yesno development. When adding new features or prioritizing the backlog, these ideas should help in decision making.

## Usage Types

1. `yesno.save, yesno.load`
1. `yesno.record, yesno.complete`
1. `yesno.test`

Case 1 is the most basic and requires the most work by the user. It is intended as an escape hatch for users that have unique or specific needs that the default usage doesn't meet. Most users should be using cases 2 and 3 (where case 3 is just a convience testing wrapper around case 2).

### Differentiating from Nock

Currently Nock can handle case 1 pretty well and we don't need to try to add value here. Nock does have nockback feature that can record and playback responses, but requires modification of the recorded response file to remove mocks. YesNo should focus on being easy to use for use cases 2 and 3 while allowing the flexibilty to handle most special cases through the rule system.

## mockRule Design

A new mockRule method will be added to allow the user to define a set of rules that will be evaluated in the order that they are defined. This will let the user control how yesno will handle recording and responding. By default, yesno will record all network requests and mock them in the order in which they were recorded. Using mockRule, matching requests can be made live instead of mocked, or the mock response can be specified instead of using the recorded value. As soon as a rule matches a request, the rule is applied and processing stops. If the user wants the default action to be live requests, then they would just create a last rule that matches everything to be live.

## Depricated Features

With the addition of mockRule and rule based processing of requests, the following legacy features will be depricated or changed. The deprecated features were confusing because they mixed request preflight behavior with intercepted response filtering.

- yesno.matching() - matching can only be run after requests have been intercepted
- yesno.matching().respond() - this is deprecated and replaced with yesno.mockRule().respond()
- yesno.matching().ignore() - this is deprecated and replaced with yesno.mockRule().live()
- yesno.matching().redact() - this redact call will only be applied to intercepted requests. To have redact apply to all requests, a mockRule.redact should be used.

## YesNo Interfaces

- `yesno.mockRule` - set of user defined rules to be applied to all requests
  - `yesno.mockRule().record()` - matching requests will be recorded/mocked
  - `yesno.mockRule().live()` - matching requests will be proxied
  - `yesno.mockRule().respond()` - matching requests will be mocked with the defined response
  - `yesno.mockRule().redact()` - matching properties will be redacted
- `yesno.matching()` - used after responses have been intercepted to filter the collection
- `yesno.mockMode()` - allows the user to match mocks multiple times, defaults to `strict` (each recorded mock matches once)
- `yesno.mockMatchingFunction()` - allows the user to override the default matching function, the callback gets passed:
  - the request data object
  - the collection of mocks
  - returns true on match

## Mock Matching logic

```
// strict mode (index based mocking, so no reusing mocks, no out of order mocks)
yesno.mockMatchingFunction((currentRequestObj, listOfMocks, mockRuleArray, requestCounter) => {
  for each mock
    for each mockRule
      - does mockRule pattern match request?
        - if so apply rule
          - one of
            - live
            - record
              - use the i mock in the mock list (and basic check that it's matching)
            - respond
              - use an inline mock (can match multiple times)
          - increment i (let's not increment i going forward)
          - stop processing rule list

Default is equivalent to yesno.mockMatchingFunction(yesno.mockMatching.STRICT)

// matching mode (request signature based mocking, can reuse mocks, handles out of order mocks)
yesno.mockMatchingFunction((currentRequestObj, listOfMocks, mockRuleArray, requestCounter) => {
  for each mock
    for each mockRule
      - does mockRule pattern match request?
        - if so apply rule
          - one of
            - live
            - record
              - for each mock
                - has mock already been used?
                - does mock have the same signature
                  - if so
                    - use mock
                    - bump the "used" counter +1
            - respond
              - use an inline mock (can match multiple times)
          - increment i (let's not increment i going forward)
          - stop processing rule list

```

## Example Use Cases

Record and mock all requests (default use case)
```
const record = yesno.recording(filename);
<network requests>
record.complete();
```

Requests A, B and the order is non-deterministic
```
const record = yesno.recording(filename);
<network requests>
record.complete();
```

Requests A, B and only want to record/mock B
```
const record = yesno.recording(filename);
yesno.mockRule(/B/).record();
yesno.mockRule(/.*/).live();
<network requests>
record.complete();
```

Requests A, B, C... and only want B to be live
```
const record = yesno.recording(filename);
yesno.mockRule(/B/).live();
<network requests>
record.complete();
```

Requests A, B and want B to have mock value X
```
const record = yesno.recording(filename);
yesno.mockRule(/B/).respond(X);
<network requests>
record.complete();
```

Redact `password` and `token` properties in requests to B
```
const record = yesno.recording(filename);
yesno.mockRule(/B/).redact([password, token]);
<network requests>
record.complete();
```
