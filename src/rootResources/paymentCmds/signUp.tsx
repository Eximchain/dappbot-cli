import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'signup';

export const desc = 'Create a new account with DappBot.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}