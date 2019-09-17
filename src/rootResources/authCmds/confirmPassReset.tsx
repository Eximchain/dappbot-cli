import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'confirmPassReset <email>';

export const desc = 'Confirm a password reset.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}