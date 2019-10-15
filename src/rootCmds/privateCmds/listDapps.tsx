import React from 'react';
import { Argv } from 'yargs';
import { App, PrettyRequest, ApiMethodLabel } from '../../ui';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData, fastRender } from '../../services/util';
import { ArgShape, UniversalArgs } from '../../cli';
import { ListDapps } from '@eximchain/dappbot-types/spec/methods/private';

export const command = `${RootResources.private}/listDapps`;

export const desc = 'List your Dapps.';

export function builder(yargs: Argv<UniversalArgs>) {
  yargs.middleware(requireAuthData);
}

export function handler(args: ArgShape) {
  fastRender(
    <App args={args} renderFunc={({ API }) => {
      return (
        <PrettyRequest
          operation={ApiMethodLabel(ListDapps.HTTP, ListDapps.Path)}
          resource={() => API.private.listDapps.resource()} />
      )
    }} />
  )
}