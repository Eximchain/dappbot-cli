import React from 'react';
import { Argv } from 'yargs';
import { App, PrettyRequest, ApiMethodLabel } from '../../ui';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData, fastRender } from '../../services/util';
import { ArgShape, DappNameArg } from '../../cli';
import { ReadDapp } from '@eximchain/dappbot-types/spec/methods/private';

export const command = `${RootResources.private}/readDapp <DappName>`;

export const desc = 'Read the details for one of your Dapps.';

export function builder(yargs: Argv) {
  yargs
    .middleware(requireAuthData)
    .positional('DappName', {
      describe: 'The name of your dapp',
      type: 'string'
    });
}

export function handler(args: ArgShape<DappNameArg>) {
  fastRender(
    <App args={args} renderFunc={({ API }) => {
      const { DappName } = args;
      return (
        <PrettyRequest 
          operation={ApiMethodLabel(ReadDapp.HTTP, ReadDapp.Path(DappName))}
          req={() => API.private.readDapp.resource(DappName)} />
      )
    }} />
  )
}