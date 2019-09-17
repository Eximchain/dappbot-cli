import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'updateDapp <DappName>';

export const desc = 'Update one of your Dapps.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>) 
}