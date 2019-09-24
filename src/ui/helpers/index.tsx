import { HttpMethods } from '@eximchain/dappbot-types/spec/responses';

export * from './BoxPads';
export * from './ArgPrompt';
export * from './PrettyRequest';
export * from './TextBox';
export * from './Loader';
export * from './ErrorBox';
export * from './SuccessBox';

export function ApiMethodLabel(method:HttpMethods.ANY, path:string) {
  return `${method} ${path}`
}