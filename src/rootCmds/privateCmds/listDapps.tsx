import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { App, PrettyRequest } from '../../ui';
import API from '@eximchain/dappbot-api-client';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData } from '../../services/util';
import { ArgShape } from '../../cli';

export const command = `${RootResources.private}/listDapps`;

export const desc = 'List your Dapps.';

export function builder(yargs:Argv) {
  yargs.middleware(requireAuthData);
}

export function handler(args:ArgShape) {
  render(
    <App args={args} renderFunc={({ API }) => {
      return (
        <PrettyRequest req={() => API.private.listDapps.call()} />
      )
    }} />
  )
}