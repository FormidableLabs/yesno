import Context from './context';
import { YesNo } from './yesno';

export { ISerializedHttpPartialDeepMatch } from './filtering/matcher';
export { IFileOptions, ISaveOptions } from './file';
export { IInterceptOptions } from './interceptor';
export { ISerializedHttp } from './http-serializer';

export const yesno = new YesNo(new Context());
export default yesno;
