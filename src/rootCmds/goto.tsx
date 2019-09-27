import { Argv } from 'yargs';
import { DappNameArg, ArgShape } from '../cli';
import open from 'open';

export const command = 'goto <DappName>';

export const desc = 'View one of the dapps hosted on DappHub.';

export function builder(yargs:Argv) {
  yargs
    .positional('DappName', {
      describe: 'The dapp you would like to view in your default browser.',
      type: 'string'
    })
}

export function handler(args:ArgShape<DappNameArg>) {
  const { DappName, hubUrl } = args;
  open(`${hubUrl}/${DappName}`)
}