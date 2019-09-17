import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'updatePlanCount standard <number>';

export const desc = 'Update the number of Dapps you are subscribed to.  Must already have payment info on file.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}