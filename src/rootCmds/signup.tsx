import React from 'react';
import Payment from '@eximchain/dappbot-types/spec/methods/payment';
import { render } from 'ink';
import { ArgShape } from '../cli';
import { App, PrettyRequest } from '../ui';

export const command = 'signup'

export const desc = 'Interactive command to create a new account with DappBot.';

export const builder = {};

export function handler(args:ArgShape) {
  render(
    <App args={args} renderFunc={({ API }) => {
      const { email, name } = args;
      return (
        <PrettyRequest req={() => API.payment.signUp.call({
          email, name,
          plans: Payment.trialStripePlan()
        })} />
      )
    }} />
  )
}