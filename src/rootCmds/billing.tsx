import { DappNameArg, ArgShape } from '../cli';
import open from 'open';
import { fastRender } from '../services/util';
import React from 'react';
import { SuccessBox } from '../ui';

export const command = 'billing';

export const desc = "Visit DappBot's billing page to update your payment info or dapp capacity.";

export const builder = {}

export function handler(args:ArgShape<DappNameArg>) {
  const url = `${args.mngrUrl}/home/user-settings`;
  fastRender(
    <SuccessBox result={{
      message: `Opening ${url} now!`
    }} />
  )
  open(url)
}