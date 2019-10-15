import React from 'react';
import { Argv } from 'yargs';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData, fastRender, analytics, standardTrackProps } from '../../services';
import { BaseOptions } from './createDapp';
import { UpdateDapp } from '@eximchain/dappbot-types/spec/methods/private';
import { DappNameArg, ArgShape, UniversalArgs } from '../../cli';
import { PrettyRequest, App, ApiMethodLabel, ErrorBox } from '../../ui';

export const command = `${RootResources.private}/updateDapp <DappName>`;

export const desc = 'Update one of your Dapps.';

export function builder(yargs:Argv<UniversalArgs>) {
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
  const { Web3URL, ContractAddr, DappName } = args;
  let updateArg = {} as UpdateDapp.Args;
  if (Web3URL) updateArg.Web3URL = Web3URL;
  if (ContractAddr) updateArg.ContractAddr = ContractAddr;
  if (args.AbiFile) updateArg.Abi = args.AbiFile;

  if (Object.keys(updateArg).length === 0) {
    return (
      fastRender(
        <ErrorBox errMsg={'No update keys specified; please include one of the options.'} />
      )
    )
  }

  // TODO: Validate Abi, just for sanity's sake

  fastRender(
    <App args={args} renderFunc={({ API }) => (
      <PrettyRequest 
        operation={ApiMethodLabel(UpdateDapp.HTTP, UpdateDapp.Path(DappName))}
        resource={() => API.private.updateDapp.resource(DappName, updateArg)}
        onSuccess={() => analytics.track({
          event: 'Dapp Updated - CLI',
          userId: API.authData.User.Email,
          properties: {
            ...standardTrackProps(API),
            DappName, ...updateArg
          }
        })} />
    )} />
  )
}