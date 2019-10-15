import React from 'react';
import { Argv, Options } from 'yargs';
import { RootResources } from '@eximchain/dappbot-types/spec/methods';
import { requireAuthData, fastRender, analytics, standardTrackProps } from '../../services';
import { ArgShape, DappNameArg, UniversalArgs } from '../../cli';
import { CreateDapp } from '@eximchain/dappbot-types/spec/methods/private';
import { App, PrettyRequest, ApiMethodLabel, ErrorBox } from '../../ui';
import { Tiers } from '@eximchain/dappbot-types/spec/dapp';

export const command = `${RootResources.private}/createDapp <DappName>`;

export const desc = 'Create a new Dapp.';

// Guardian is on ice right now, we've been using
// placeholder values for the addresses.  Going to
// use this so it's extra obvious that it's a
// placeholder, rather than an old instance
// or something.
export const GuardianURL = 'https://example.com';

export function BaseOptions(addtlOptions: Options): Options {
  let baseOptions: Options = {
    demandOption: true,
    requiresArg: true,
    group: 'Arguments:'
  }
  return Object.assign(baseOptions, addtlOptions);
}

export function builder(yargs:Argv<UniversalArgs>) {
  yargs
    .middleware(requireAuthData)
    .positional('DappName', {
      type: 'string',
      describe: 'The name for your new Dapp.'
    })
    .options({
      'AbiPath': BaseOptions({
        type: 'string',
        alias: 'b',
        normalize: true
      }),
      'ContractAddr': BaseOptions({
        type: 'string',
        alias: 'c'
      }),
      'Web3URL': BaseOptions({
        type: 'string',
        alias: 'w'
      }),
      'Tier': BaseOptions({
        type: 'string',
        alias: 't',
        choices: Object.values(Tiers)
      })
    });
}

export function handler(args: ArgShape<CreateDapp.Args & DappNameArg>) {
  const { Web3URL, Tier, ContractAddr, DappName } = args;
  if (!args.AbiFile) {
    return fastRender(
      <ErrorBox errMsg={"An abiFile must be present; it should exist if you have included a valid --abiPath."} />
    )
  }
  const Abi = args.AbiFile;
  // TODO: Validate Abi, just for sanity's sake

  const createArgs = { Web3URL, GuardianURL, ContractAddr, Tier, Abi };
  fastRender(
    <App args={args} renderFunc={({ API }) => {
      return (
        <PrettyRequest
          operation={ApiMethodLabel(CreateDapp.HTTP, CreateDapp.Path(DappName))}
          resource={() => API.private.createDapp.resource(DappName, createArgs)} 
          onSuccess={() => analytics.track({
            event: 'Dapp Created - CLI',
            userId: API.authData.User.Email,
            properties: {
              ...standardTrackProps(API),
              DappName, ...createArgs
            }
          })} />
      )
    }} />
  )
}