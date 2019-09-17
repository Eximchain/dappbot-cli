import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';

export const command = 'read';

export const desc = 'Read your Stripe payment details, like your subscription and the upcoming invoice, as JSON data.';

export const builder = {};

export function handler(argv:Argv) {
  render(<Echo argv={argv}/>)
}