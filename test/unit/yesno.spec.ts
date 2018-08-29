import { expect } from 'chai';
import Mitm from 'mitm';
import * as rp from 'request-promise';

describe('yesno', () => {
  it('should mock requests', async () => {
    const mitm = Mitm();

    // mitm.on('connect', function(socket, opts) {
    //   console.trace('connect');
    // });

    mitm.on('request', function(req: any, res) {
      // console.trace('request');
      req.socket.bypass();
      // req.resume();
      // console.log('Uh', this);
    });

    const result: string = await rp.get('http://www.google.com', {
      resolveWithFullResponse: true,
    });

    expect(result).to.have.property('statusCode', 200);
  });
});
