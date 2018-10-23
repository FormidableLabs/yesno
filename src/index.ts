import Context from './context';
import { YesNo } from './yesno';

const yesno = new YesNo(new Context());

export const enable = yesno.enable.bind(yesno);
export const disable = yesno.disable.bind(yesno);
export const clear = yesno.clear.bind(yesno);
export const save = yesno.save.bind(yesno);
export const matching = yesno.matching.bind(yesno);
export const intercepted = yesno.intercepted.bind(yesno);
export const redact = yesno.redact.bind(yesno);
export const mocks = yesno.mocks.bind(yesno);
export const spy = yesno.spy.bind(yesno);
export const mock = yesno.mock.bind(yesno);
