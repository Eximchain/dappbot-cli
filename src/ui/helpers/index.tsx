import { HttpMethods } from '@eximchain/dappbot-types/spec/responses';
import { RequestError } from 'react-request-hook';
import { ChainIdentity } from '../../services/util';

export * from './BoxPads';
export * from './ArgPrompt';
export * from '../PrettyRequest';
export * from './TextBox';
export * from './Loader';
export * from './ErrorBox';
export * from './SuccessBox';
export * from './ItemList';

export function ApiMethodLabel(method:HttpMethods.ANY, path:string) {
  return `${method} ${path}`
}

export function errMsgFromResource(error:RequestError):string {
  let errMsg;
  try {
    errMsg = `${error.code}: ${error.data.err.message}`;
  } catch (err) {
    errMsg = '\n\n'+JSON.stringify(error.data, null, 2);
  }
  return errMsg;
}

export function ChainName(chainId:number, chain?:ChainIdentity) {
  return chain ? (
    `${chain.displayName} - Chain ID ${chain.chainId}`
  ) : (
    `Custom Chain - Chain ID ${chainId}`
  )
}

export function ChainOption(chainId:number, chain?:ChainIdentity) {
  return chain ? ({
    label: ChainName(chainId, chain), value: chain.key
  }) : ({
    label: ChainName(chainId), value: chainId
  })
}