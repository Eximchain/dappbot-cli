import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { PrettyRequest, App } from '../../ui';
import { commandFromSampleArgs, describePositionalArgs } from '../../services/util';
import { ArgShape } from '../../cli';
import { BeginPassReset } from '@eximchain/dappbot-types/spec/methods/auth';

export const commandName = `${RootResources.auth}/beginPassReset`;

export const command = commandFromSampleArgs(commandName, BeginPassReset.newArgs());

export const desc = 'Request to have your password reset.';

export function builder(yargs: Argv) {
  describePositionalArgs(yargs, BeginPassReset.newArgs(), {
    'username': 'Your account email.'
  });
}

export function handler(args: ArgShape<BeginPassReset.Args>) {
  render(App({
    args,
    renderFunc: ({ API }) => {
      let { username } = args;
      let req = () => API.auth.beginPasswordReset.call({ username })
      return (
        <PrettyRequest req={req} />
      )
    }
  }
  ))
}