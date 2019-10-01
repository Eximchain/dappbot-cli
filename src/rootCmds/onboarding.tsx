import { DappNameArg, ArgShape } from '../cli';
// @ts-ignore
import BigText from 'ink-big-text';
import { fastRender } from '../services/util';
import React from 'react';
import { Box } from 'ink';
import { ItemList, Rows, ChevronText } from '../ui';
import { Argv } from 'yargs';

export const command = 'onboarding';

export const desc = false;

export const builder = {};

export function handler(args: ArgShape<DappNameArg>) {
  // console.log(process.env.NODE_ENV)
  process.env.NODE_ENV = 'production';
  fastRender(
    <Box margin={1}>
      <Rows>
        <BigText text='DappBot'
          align='center'
          lineHeight={2}
          colors={['#267EDC','#267EDC','#267EDC']}
          font='chrome' />
        <ChevronText>
          Welcome to DappBot by Eximchain!  Your smart contract development is about to get supercharged.
        </ChevronText>
        <ChevronText>
          This nodejs CLI client is MIT-licensed, ready to incorporate into your own tools.
        </ChevronText>
        <ChevronText>
          Here are some sample commands to help you get started.  Happy hacking!
        </ChevronText>
        <ItemList items={{
          'dappbot': 'Get overall usage info',
          'dappbot signup': 'Create a new DappBot account',
          'dappbot login': 'Login with an existing DappBot account.',
          'dappbot truffle': 'Wizard to interactively create a dapp from Truffle build files.'
        }} />
      </Rows>
    </Box>
  )
}