import React from 'react';
import fs from 'fs';
import { Argv } from 'yargs';
import { render } from 'ink';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData } from '../../services/util';
import { BaseOptions, GuardianURL } from './createDapp';
import { UpdateDapp } from '@eximchain/dappbot-types/spec/methods/private';
import { DappNameArg, ArgShape } from '../../cli';
import { PrettyRequest, App } from '../../ui';

export const command = `${RootResources.private}/updateDapp <DappName>`;

export const desc = 'Update one of your Dapps.';

export function builder(yargs:Argv) {
  yargs
  .middleware(requireAuthData)
  .positional('DappName', {
    type: 'string',
    describe: 'The name for your new Dapp.'
  })
  .options({
    'AbiPath' : BaseOptions({
      type: 'string',
      alias: 'b',
      normalize: true,
      demandOption: false
    }),
    'ContractAddr': BaseOptions({
      type: 'string',
      alias: 'c',
      demandOption: false
    }),
    'Web3URL': BaseOptions({
      type: 'string',
      alias: 'w',
      demandOption: false
    })
  });
}

export function handler(args:ArgShape<UpdateDapp.Args & DappNameArg>) {
  render(
    <App args={args} renderFunc={({ API }) => {
      const { Web3URL, ContractAddr, DappName } = args;
      let updateArg = {} as UpdateDapp.Args;
      if (Web3URL) updateArg.Web3URL = Web3URL;
      if (ContractAddr) updateArg.ContractAddr = ContractAddr;
      if (args.AbiFile) updateArg.Abi = args.AbiFile;

      if (Object.keys(updateArg).length === 0) {
        console.log('No update keys specified; please include one of the options.');
        process.exit(1);
      }

      // TODO: Validate Abi, just for sanity's sake

      return (
        <PrettyRequest req={() => API.private.updateDapp.call(DappName, updateArg)} />
      )
    }} />
  )
}