
import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'login <email> <password>';

export const desc = 'Login to DappBot.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}