import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData } from '../../services/util';

export const command = `${RootResources.private}/updateDapp <DappName>`;

export const desc = 'Update one of your Dapps.';

export function builder(yargs:Argv) {
  yargs.middleware(requireAuthData);
}

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>) 
}