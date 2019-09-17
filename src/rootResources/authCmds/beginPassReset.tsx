import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'beginPassReset <email>';

export const desc = 'Confirm your password reset.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}