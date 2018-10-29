import Context from './context';
import { YesNo } from './yesno';

export { IInterceptOptions } from './yesno';
export { ISerializedHttp } from './http-serializer';

export const yesno = new YesNo(new Context());
export default yesno;
