import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'refresh <RefreshToken>';

export const desc = 'Use your RefreshToken to get fresh Authorization.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}