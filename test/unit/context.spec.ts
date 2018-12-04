import { expect } from 'chai';
import { SinonSandbox as Sandbox, SinonStub as Stub } from 'sinon';
import * as sinon from 'sinon';

import Context, { IInFlightRequest } from '../../src/context';
import { ISerializedHttp } from '../../src/http-serializer';

describe('context', () => {
  const sandbox: Sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  let instance: Context;
  beforeEach(() => {
    instance = new Context();
  });

  describe('constructor', () => {
    it('returns a configured instance of Context', () => {
      expect(instance).instanceOf(Context);
    });
  });

  describe('clear', () => {
    it('resets internal arrays and state variables', () => {
      // add some stuff to see it go away
      instance.interceptedRequestsCompleted = [{}, {}] as [ISerializedHttp, ISerializedHttp];
      instance.loadedMocks = [{}, {}] as [ISerializedHttp, ISerializedHttp];
      instance.inFlightRequests = [null, null];

      instance.clear();

      expect(instance.interceptedRequestsCompleted).deep.equals([]);
      expect(instance.inFlightRequests).deep.equals([]);
      expect(instance.loadedMocks).deep.equals([]);
    });
  });
});
