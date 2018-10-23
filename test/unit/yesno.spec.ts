import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { Mode, YesNo } from '../../src';

describe('Yesno', () => {
  const dir: string = path.join(__dirname, 'tmp');

  describe('#save', () => {
    const name = 'mock-save';
    const expectedFilename = path.join(dir, `${name}-yesno.json`);
    let yesno: YesNo;

    afterEach(() => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(dir, file));
      });

      if (yesno) {
        yesno.disable();
      }
    });

    it('should save intercepted requests in the configured directory', async () => {
      yesno = new YesNo({ dir });
      yesno.enable();

      yesno.interceptedRequestsCompleted = [
        {
          __duration: 1,
          __id: 'foobar',
          __timestamp: 1,
          __version: 'foo',
          request: {
            headers: {},
            host: 'mock.com',
            method: 'GET',
            path: '/',
            port: 80,
            protocol: 'http',
          },
          response: {
            headers: {},
            statusCode: 200,
          },
          url: 'bar',
        },
      ];
      const expectedContents = JSON.stringify(
        { records: yesno.interceptedRequestsCompleted },
        null,
        2,
      );
      const filename = await yesno.save(name);

      expect(filename, 'Returns the full filename').to.eql(expectedFilename);
      const contents = fs.readFileSync(filename as string).toString();
      expect(contents, 'Contents are JSON').to.eql(expectedContents);
    });

    it('should parse a JSON body');
  });

  describe('#intercepted', () => {
    let yesno: YesNo;

    beforeEach(() => {
      yesno = new YesNo();
    });

    it('should allow the user to retrieve completed requests by url');
  });
});
