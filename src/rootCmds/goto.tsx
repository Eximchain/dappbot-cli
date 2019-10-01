import { Argv } from 'yargs';
import { DappNameArg, ArgShape } from '../cli';
import open from 'open';
import { fastRender } from '../services/util';
import React from 'react';
import { SuccessBox } from '../ui';

export const command = 'goto <DappName>';

export const desc = 'Visit one of the dapps hosted on DappHub.';

export function builder(yargs:Argv) {
  yargs
    .positional('DappName', {
      describe: 'The dapp you would like to view in your default browser.',
      type: 'string'
    })
}

export function handler(args:ArgShape<DappNameArg>) {
  const { DappName, hubUrl } = args;
  const url = `${hubUrl}/${DappName}`;
  fastRender(
    <SuccessBox result={{
      message: `Opening ${url} now!`
    }} />
  )
  open(url);
}