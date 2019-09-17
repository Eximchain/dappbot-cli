import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';
import API from '@eximchain/dappbot-api-client';

export const command = 'listDapps';

export const desc = 'List your Dapps.';

export const builder = {};

export function handler(argv:Argv) {

  const listResponse = 
  render(<Echo argv={argv}/>)
}