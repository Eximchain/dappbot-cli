import React from 'react';
import { Argv } from 'yargs';
import { render } from 'ink';
import { GUIBase, PrettyRequest } from '../../ui';

export const command = 'viewDapp <DappName>';

export const desc = 'View the public details of any deployed Dapp.';

export const builder = {};

interface ViewDappArgv {
  DappName: string
}

export function handler(argv:Argv<ViewDappArgv>) {
  render(<GUIBase argv={argv} render={({ API }) => {
    const DappName = argv.argv.DappName;
    return (
      <PrettyRequest req={()=>API.public.viewDapp.call(DappName)} />
    )
  }} />)
}