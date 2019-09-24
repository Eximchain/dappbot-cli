import React from 'react';
import { Argv } from 'yargs';
import { PrettyRequest, App, ApiMethodLabel } from '../../ui';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { commandFromSampleArgs, describePositionalArgs, fastRender } from '../../services/util';
import { ArgShape } from '../../cli';
import { Login } from '@eximchain/dappbot-types/spec/methods/auth';

export const commandName = `${RootResources.auth}/login`;

export const command = commandFromSampleArgs(commandName, Login.newArgs());

export const desc = 'Login to DappBot.';

export function builder(yargs: Argv) {
  describePositionalArgs(yargs, Login.newArgs());
}

export function handler(args: ArgShape<Login.Args>) {
  fastRender(
    <App args={args} renderFunc={({ API }) => {
      let { username, password } = args;
      return (
        <PrettyRequest
          operation={ApiMethodLabel(Login.HTTP, Login.Path)}
          req={() => API.auth.login.resource({
            username, password
          })} />
      )
    }} />
  )
}