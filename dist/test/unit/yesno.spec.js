"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const mitm_1 = __importDefault(require("mitm"));
const rp = __importStar(require("request-promise"));
describe('yesno', () => {
    it('should mock requests', async () => {
        const mitm = mitm_1.default();
        mitm.on('request', function (req, res) {

            console.log('We got a request');
            // req.resume();
            console.log('Uh', this);
        });
        // mitm.on('response', (req, res) => {
        //   console.log('We got a response');
        // });
        const result = await rp.get('http://www.google.com', {
            resolveWithFullResponse: true,
        });
        chai_1.expect(result).to.have.property('statusCode', 200);
    });
});
//# sourceMappingURL=yesno.spec.js.map