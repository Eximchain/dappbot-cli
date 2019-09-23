import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { commandFromSampleArgs, describePositionalArgs } from '../../services/util';
import { PrettyRequest, App } from '../../ui';
import { ArgShape } from '../../cli';
import { Refresh } from '@eximchain/dappbot-types/spec/methods/auth';

export const commandName = `${RootResources.auth}/refresh`;

export const command = commandFromSampleArgs(commandName, Refresh.newArgs());

export const desc = 'Use your RefreshToken to get fresh Authorization.';

export function builder(yargs: Argv) {
  describePositionalArgs(yargs, Refresh.newArgs(), {
    'refreshToken': 'The RefreshToken from an earlier successful login call.'
  });
}

export function handler(args: ArgShape<Refresh.Args>) {
  render(App({
    args,
    renderFunc: ({ API }) => {
      let { refreshToken } = args;
      let req = () => API.auth.refresh.call({ refreshToken })
      return (
        <PrettyRequest req={req} />
      )
    }
  }
  ))
}