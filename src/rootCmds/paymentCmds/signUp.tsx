import React from 'react';
import { RootResources, Payment } from '@eximchain/dappbot-types/spec/methods';
import { Argv } from 'yargs';
import { render } from 'ink';
import Echo from '../../ui/echo';
import { commandFromSampleArgs } from '../../services/util';
import { ArgShape } from '../../cli';
import { App, PrettyRequest } from '../../ui';

export const commandName = `${RootResources.payment}/signup`;

type SignUpNoPlan = Omit<Payment.SignUp.Args, 'plans'>

export const command = commandFromSampleArgs(commandName, Payment.SignUp.newArgs());

export const desc = 'Create a new account with DappBot.';

export const builder = {};

export function handler(args:ArgShape<SignUpNoPlan>) {
  render(
    <App args={args} renderFunc={({ API }) => {
      return (
        <PrettyRequest req={() => API.payment.readStripe.call()} />
      )
    }} />
  )
}