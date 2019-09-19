import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData } from '../../services/util';

export const command = `${RootResources.private}/createDapp <email>`;

export const desc = 'Create a new Dapp.';

export function builder(yargs:Argv) {
  yargs.middleware(requireAuthData);
}

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}