import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinonChai = require('sinon-chai');

chai.use(sinonChai);
chai.use(chaiAsPromised as any);
