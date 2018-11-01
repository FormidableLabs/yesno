import Context from './context';
import { YesNo } from './yesno';

export { ISerializedHttpPartialDeepMatch } from './filtering/matcher';
export { IFileOptions, ISaveOptions } from './file';
export { IInterceptOptions } from './yesno';
export { ISerializedHttp } from './http-serializer';

export const yesno = new YesNo(new Context());
export default yesno;
