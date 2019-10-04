import { HttpMethods } from '@eximchain/dappbot-types/spec/responses';
import { RequestError } from 'react-request-hook';
import { Chain } from '@eximchain/dappbot-types/spec/dapp';

export const LIGHT_BLUE = '#78B4F2';
export const EXIM_BLUE = '';

export function ApiMethodLabel(method:HttpMethods.ANY, path:string) {
  return `${method} ${path}`
}

export function errMsgFromResource(error:RequestError):string {
  let errMsg;
  try {
    errMsg = `${error.data.err.message} (HTTP ${error.code})`;
  } catch (err) {
    errMsg = '\n\n'+JSON.stringify(error.data, null, 2);
  }
  return errMsg;
}

export function ChainName(chainId:number, chain?:Chain.Details) {
  return chain ? (
    `${chain.displayName} - Chain ID ${chain.id}`
  ) : (
    `Custom Chain - Chain ID ${chainId}`
  )
}

export function ChainOption(chainId:number, chain?:Chain.Details) {
  return chain ? ({
    label: ChainName(chainId, chain), value: chain.name
  }) : ({
    label: ChainName(chainId), value: chainId
  })
}

export * from './BoxPads';
export * from './ChevronText';
export * from './ArgPrompt';
export * from '../PrettyRequest';
export * from './TextBox';
export * from './Loader';
export * from './ErrorLabel';
export * from './ErrorBox';
export * from './SuccessLabel';
export * from './SuccessBox';
export * from './ItemList';
export * from './Select';
export * from './Rows';