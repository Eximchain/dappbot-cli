import { Argv } from 'yargs';
import { DappNameArg, ArgShape } from '../cli';
import open from 'open';

export const command = 'billing';

export const desc = "Visit DappBot's billing page to update your payment info or dapp capacity.";

export function builder(yargs:Argv) {

}

export function handler(args:ArgShape<DappNameArg>) {
  open(`${args.mngrUrl}/home/user-settings`)
}