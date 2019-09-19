import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { RootResources, Auth } from '@eximchain/dappbot-types/spec/methods';
import { PrettyRequest, App } from '../../ui';
import { commandFromSampleArgs, describePositionalArgs } from '../../services/util';
import { ArgShape } from '../../cli';

export const commandName = `${RootResources.auth}/confirmPassReset`;

export const command = commandFromSampleArgs(commandName, Auth.ConfirmPassReset.newArgs());

export const desc = 'Confirm a password reset.';

export function builder(yargs: Argv) {
  describePositionalArgs(yargs, Auth.ConfirmPassReset.newArgs(), {
    'username': 'Your account email.',
    'passwordResetCode': 'The code you received in your email.',
    'newPassword': 'A new password for your account; at least 8 characters long.'
  });
}

export function handler(args: ArgShape<Auth.ConfirmPassReset.Args>) {
  render(App({
    args,
    renderFunc: ({ API, opts }) => {
      let { username, newPassword, passwordResetCode } = opts;
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