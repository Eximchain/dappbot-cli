import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { PrettyRequest, App } from '../../ui';
import { ArgShape, DappNameArg } from '../../cli';

export const commandName = `${RootResources.public}/viewDapp`;

export const command = `${commandName} <DappName>`;

export const desc = 'View the public details of any deployed Dapp.';

export function builder(yargs: Argv) {
  yargs
    .positional('DappName', {
      describe: 'The name of the dapp whose public details you want to see.',
      type: 'string'
    })
}

export function handler(args: ArgShape<DappNameArg>) {
  render(
    <App args={args} renderFunc={({ API, opts }) => {
      const DappName = opts.DappName;
      return (
        <PrettyRequest req={() => API.public.viewDapp.call(DappName)} />
      )
    }} />
  )
}