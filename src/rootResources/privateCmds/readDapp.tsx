import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'readDapp <DappName>';

export const desc = 'Read the details for one of your Dapps.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}