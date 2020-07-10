"use strict";

const { expect } = require("chai");
const rp = require('request-promise');

describe('TODO REMOVE mitm-experiments', () => {
  const TEST_HEADER_VALUE = 'foo';
  const TEST_BODY_VALUE = 'fiz';
  let interceptor;

  before(() => {
    interceptor = new (require("../mitm-experiments/index")).Interceptor();
  });

  beforeEach(() => {
    interceptor.enable()
  });

  afterEach(() => {
    if (interceptor) {
      interceptor.disable();
    }
  });

  it.only('should proxy HTTPS POST requests', async () => {
    const response = await rp.post({
      body: {
        test: TEST_BODY_VALUE,
      },
      headers: {
        'x-test-header': TEST_HEADER_VALUE,
      },
      json: true,
      uri: 'https://postman-echo.com/post',
    });

    expect(response, 'Missing response').to.be.ok;
    expect(response).to.have.nested.property('headers.x-test-header', TEST_HEADER_VALUE);
    expect(response).to.have.nested.property('json.test', TEST_BODY_VALUE);
  });
});
