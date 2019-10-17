import React from 'react';
import { Argv } from 'yargs';
import { App, PrettyRequest, ApiMethodLabel } from '../../ui';
import { ArgShape, DappNameArg, UniversalArgs } from '../../cli';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData, fastRender, trackDeleteDapp } from '../../services';
import { DeleteDapp } from '@eximchain/dappbot-types/spec/methods/private';

export const command = `${RootResources.private}/deleteDapp <DappName>`;

export const desc = 'Delete one of your Dapps.';

export function builder(yargs:Argv<UniversalArgs>) {
  yargs.middleware(requireAuthData);
}

export function handler(args:ArgShape<DappNameArg>) {
  fastRender(
    <App args={args} renderFunc={({ API }) => {
      const DappName = args.DappName;
      return (
        <PrettyRequest 
          operation={ApiMethodLabel(DeleteDapp.HTTP, DeleteDapp.Path(DappName))}
          resource={() => API.private.deleteDapp.resource(DappName)} 
          onSuccess={() => trackDeleteDapp(API, DappName)} />
      )
    }} />
  )
}