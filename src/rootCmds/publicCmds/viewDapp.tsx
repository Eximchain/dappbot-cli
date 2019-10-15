import React from 'react';
import { Argv } from 'yargs';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { PrettyRequest, App, ApiMethodLabel } from '../../ui';
import { ArgShape, DappNameArg } from '../../cli';
import { fastRender } from '../../services/util';
import { ViewDapp } from '@eximchain/dappbot-types/spec/methods/public';

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
  fastRender(
    <App args={args} renderFunc={({ API }) => {
      const DappName = args.DappName;
      return (
        <PrettyRequest  
          operation={ApiMethodLabel(ViewDapp.HTTP, ViewDapp.Path(DappName))} 
          resource={() => API.public.viewDapp.resource(DappName)} />
      )
    }} />
  )
}