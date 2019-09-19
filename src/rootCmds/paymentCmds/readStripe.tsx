import React from 'react';
import { RootResources, Payment } from '@eximchain/dappbot-types/spec/methods';
import { Argv } from 'yargs';
import { render } from 'ink';
import { requireAuthData } from '../../services/util';
import { App, PrettyRequest } from '../../ui';
import { ArgShape } from '../../cli';

export const command = `${RootResources.payment}/read`;

export const desc = 'Read your Stripe payment details as JSON data.';

export function builder(yargs:Argv) {
  yargs.middleware(requireAuthData);
}

export function handler(args:ArgShape) {
  render(
    <App args={args} renderFunc={({ API }) => {
      return (
        <PrettyRequest req={() => API.payment.readStripe.call()} />
      )
    }} />
  )
}