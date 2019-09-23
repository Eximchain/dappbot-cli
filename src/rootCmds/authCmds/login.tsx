
import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { PrettyRequest, App } from '../../ui';
import Responses from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { commandFromSampleArgs, describePositionalArgs } from '../../services/util';
import { ArgShape } from '../../cli';
import { Login } from '@eximchain/dappbot-types/spec/methods/auth';


export const commandName = `${RootResources.auth}/login`;

export const command = commandFromSampleArgs(commandName, Login.newArgs());

export const desc = 'Login to DappBot.';

export function builder(yargs: Argv) {
  describePositionalArgs(yargs, Login.newArgs());
}

export function handler(args: ArgShape<Login.Args>) {
  render(
    <App args={args} renderFunc={({ API }) => {
      let { username, password } = args;
      let req = () => API.auth.login.call({
        username, password
      })
      return (
        <PrettyRequest req={req} />
      )
    }} />
  )
}