import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { App, PrettyRequest } from '../../ui';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData } from '../../services/util';
import { ArgShape, DappNameArg } from '../../cli';

export const command = `${RootResources.private}/readDapp <DappName>`;

export const desc = 'Read the details for one of your Dapps.';

export function builder(yargs:Argv) {
  yargs
    .middleware(requireAuthData)
    .positional('DappName', {
      describe: 'The name of your dapp',
      type: 'string'
    });
}

export function handler(args:ArgShape<DappNameArg>) {
  render(
  <App args={args} renderFunc={({ API }) => {
    const { DappName } = args;
    return (
      <PrettyRequest req={() => API.private.readDapp.call(DappName)} />
    )
  }} />
  )
}