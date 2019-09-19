import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { App, PrettyRequest } from '../../ui';
import { ArgShape, DappNameArg } from '../../cli';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData } from '../../services/util';

export const command = `${RootResources.private}/deleteDapp <DappName>`;

export const desc = 'Delete one of your Dapps.';

export function builder(yargs:Argv) {
  yargs.middleware(requireAuthData);
}

export function handler(args:ArgShape<DappNameArg>) {
  render(
    <App args={args} renderFunc={({ API, opts }) => {
      const DappName = opts.DappName;
      return (
        <PrettyRequest req={() => API.private.deleteDapp.call(DappName)} />
      )
    }} />
  )
}