import React from 'react';
import { render } from 'ink';
import { ArgShape } from '../cli';
import { App, SignupFlow } from '../ui';

export const command = 'signup'

export const desc = 'Create a new account with DappBot.';

export const builder = {};

export function handler(args:ArgShape) {
  render(
    <App args={args} renderFunc={(props) => <SignupFlow {...props} />} />
  )
}