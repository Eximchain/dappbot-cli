import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { RootResources, Auth } from '@eximchain/dappbot-types/spec/methods';
import { PrettyRequest, App } from '../../ui';
import { commandFromSampleArgs, describePositionalArgs } from '../../services/util';
import { ArgShape } from '../../cli';
import { ConfirmPassReset } from '@eximchain/dappbot-types/spec/methods/auth';

export const commandName = `${RootResources.auth}/confirmPassReset`;

export const command = commandFromSampleArgs(commandName, ConfirmPassReset.newArgs());

export const desc = 'Confirm a password reset.';

export function builder(yargs: Argv) {
  describePositionalArgs(yargs, ConfirmPassReset.newArgs(), {
    'username': 'Your account email.',
    'passwordResetCode': 'The code you received in your email.',
    'newPassword': 'A new password for your account; at least 8 characters long.'
  });
}

export function handler(args: ArgShape<Auth.ConfirmPassReset.Args>) {
  render(App({
    args,
    renderFunc: ({ API }) => {
      let { username, newPassword, passwordResetCode } = args;
      let req = () => API.auth.confirmPasswordReset.call({
        username, newPassword, passwordResetCode
      })
      return (
        <PrettyRequest req={req} />
      )
    }
  }
  ))
}