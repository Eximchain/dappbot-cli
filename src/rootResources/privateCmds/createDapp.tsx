import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'createDapp <email>';

export const desc = 'Create a new Dapp.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}