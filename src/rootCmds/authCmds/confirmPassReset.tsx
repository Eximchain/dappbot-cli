import React from 'react';
import { Argv } from 'yargs';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { PrettyRequest, App, ApiMethodLabel } from '../../ui';
import { commandFromSampleArgs, describePositionalArgs, fastRender } from '../../services/util';
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

export function handler(args: ArgShape<ConfirmPassReset.Args>) {
  fastRender(App({
    args,
    renderFunc: ({ API }) => {
      let { username, newPassword, passwordResetCode } = args;
      return (
        <PrettyRequest
          operation={ApiMethodLabel(ConfirmPassReset.HTTP, ConfirmPassReset.Path)} 
          req={() => API.auth.confirmPasswordReset.resource({
            username, newPassword, passwordResetCode
          })} />
      )
    }
  }
  ))
}