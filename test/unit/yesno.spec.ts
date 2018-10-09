import { expect } from 'chai';
import * as fs from 'fs';
import * as path from 'path';
import { Mode, YesNo } from '../../src';

describe('Yesno', () => {
  const dir: string = path.join(__dirname, 'tmp');

  describe('#save', () => {
    const name = 'mock-save';
    const expectedFilename = path.join(dir, `${name}-yesno.json`);

    afterEach(() => {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        fs.unlinkSync(path.join(dir, file));
      });
    });

    it('should save intercepted requests in the configured directory', async () => {
      const yesno: YesNo = new YesNo({ dir, mode: Mode.Record });
      yesno.interceptedRequests = [{
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
      }];
      const expectedContents = JSON.stringify(yesno.interceptedRequests);
      const filename = await yesno.save(name);

      expect(filename, 'Returns the full filename').to.eql(expectedFilename);
      const contents = fs.readFileSync(filename as string).toString();
      expect(contents, 'Contents are JSON').to.eql(expectedContents);
    });

    it('should parse a JSON body');
  });
});
