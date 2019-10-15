import React from 'react';
import { Argv } from 'yargs';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { PrettyRequest, App, ApiMethodLabel,  } from '../../ui';
import { commandFromSampleArgs, describePositionalArgs, fastRender } from '../../services/util';
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
  fastRender(App({
    args,
    renderFunc: ({ API }) => {
      let { username } = args;
      return (
        <PrettyRequest 
          operation={ApiMethodLabel(BeginPassReset.HTTP, BeginPassReset.Path)}
          resource={() => API.auth.beginPasswordReset.resource({ username })} />
      )
    }
  }
  ))
}