import { expect } from 'chai';
import * as http from 'http';
import { ISerializedRequest, RequestSerializer } from '../../src/http-serializer';
import Interceptor, { IInterceptEvent } from '../../src/interceptor';
import * as testClient from '../test-client';
import * as testServer from '../test-server';

describe('Interceptor', () => {
  let server: testServer.ITestServer;
  let interceptor: Interceptor;

  before(async () => {
    server = await testServer.start();
  });

  afterEach(() => {
    if (interceptor) {
      interceptor.disable();
    }
  });

  after(() => {
    server.close();
  });

  describe('#enable', () => {
    it('should allow us to proxy via the intercept event', async () => {
      interceptor = new Interceptor();
      interceptor.enable();

      const serverCount = server.getRequestCount();
      let intercepted = 0;
      interceptor.on('intercept', ({ proxy }) => {
        intercepted++;
        proxy();
      });

      const body = { foo: 'bar' };
      const response = await testClient.postRequest({ json: true, body });

      expect(server.getRequestCount(), 'Server received request').to.eql(serverCount + 1);
      expect(intercepted, 'Request intercepted').to.eql(1);
      expect(response, 'Echo response is correct').to.deep.include({
        body,
        method: 'POST',
        path: '/post',
      });
    });

    it('should allow ignoring ports', async () => {
      interceptor = new Interceptor();
      interceptor.enable({ ignorePorts: [testServer.PORT] });

      const serverCount = server.getRequestCount();
      let intercepted = 0;
      interceptor.on('intercept', () => intercepted++);

      const body = { foo: 'bar' };
      await testClient.postRequest({ json: true, body });

      expect(server.getRequestCount(), 'Server got request').to.eql(serverCount + 1);
      expect(intercepted, 'No requests were intercepted').to.eql(0);
    });

    it('should be configurable by port');
    it('should abort the proxied request if the intercepted request is aborted');
    it('should emit an error on the intercepted request if the proxied request errors');
    it('should timeout the intercepted request if the proxied request times out');
  });

  describe('#disable', () => {
    it('should disable HTTP request intercepting', async () => {
      interceptor = new Interceptor();
      interceptor.enable();

      const serverCount = server.getRequestCount();
      let intercepted = 0;
      interceptor.on('intercept', ({ proxy }) => {
        intercepted++;
        proxy();
      });

      await testClient.getRequest(); // 1
      await testClient.getRequest(); // 2

      interceptor.disable();
      await testClient.getRequest(); // Not intercepted

      expect(server.getRequestCount(), 'Server got 3 requests').to.eql(serverCount + 3);
      expect(intercepted, 'Only intercepted first 2').to.eql(2);
    });
  });

  describe('event "intercept"', () => {
    it('should should provide us a reference to the originating ClientRequest', async () => {
      interceptor = new Interceptor();
      interceptor.enable();

      let interceptEvent: IInterceptEvent | undefined;
      interceptor.on('intercept', (e: IInterceptEvent) => {
        interceptEvent = e;
        e.proxy();
      });

      const body = { foo: 'bar' };
      await testClient.postRequest({ json: true, body });

      expect(interceptEvent).to.be.ok;
      expect(interceptEvent)
        .to.have.property('clientRequest')
        .instanceof(http.ClientRequest);
      expect(interceptEvent)
        .to.have.property('interceptedRequest')
        .instanceof(http.IncomingMessage);
      expect(interceptEvent)
        .to.have.property('interceptedResponse')
        .instanceof(http.ServerResponse);
      expect(interceptEvent)
        .to.have.property('requestSerializer')
        .instanceof(RequestSerializer);
      expect(interceptEvent).to.have.property('requestNumber', 0);
    });
  });

  describe('event "proxied"', () => {
    it('should emit a "proxied" event when a request is proxied', async () => {
      return new Promise(async (resolve) => {
        interceptor = new Interceptor();
        interceptor.enable();

        let didIntercept = false;

        interceptor.on('intercept', ({ proxy }: IInterceptEvent) => {
          didIntercept = true;

          proxy();
        });

        interceptor.on('proxied', () => {
          expect(didIntercept).to.eql(true); // Intercept must happen first

          resolve();
        });

        await testClient.getRequest();
      });
    });
  });
});
