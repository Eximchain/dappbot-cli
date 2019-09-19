import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { RootResources, Auth } from '@eximchain/dappbot-types/spec/methods';
import { PrettyRequest, App } from '../../ui';
import { commandFromSampleArgs, describePositionalArgs } from '../../services/util';
import { ArgShape } from '../../cli';

export const commandName = `${RootResources.auth}/beginPassReset`;

export const command = commandFromSampleArgs(commandName, Auth.BeginPassReset.newArgs());

export const desc = 'Request to have your password reset.';

export function builder(yargs: Argv) {
  describePositionalArgs(yargs, Auth.BeginPassReset.newArgs(), {
    'username': 'Your account email.'
  });
}

export function handler(args: ArgShape<Auth.BeginPassReset.Args>) {
  render(App({
    args,
    renderFunc: ({ API, opts }) => {
      let { username } = opts;
      let req = () => API.auth.beginPasswordReset.call({ username })
      return (
        <PrettyRequest req={req} />
      )
    }
  }
  ))
}