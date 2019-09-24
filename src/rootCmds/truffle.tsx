import React from 'react';
import { fastRender } from "../services/util";
import { App, TruffleFlow } from "../ui";
import { ArgShape } from "../cli";

export const command = 'truffle';

export const desc = 'Interactive command: run in a Truffle project directory to make a dapp for one of your deployed contracts.';

export const builder = {}

export function handler(args:ArgShape) {
  // TODO: Should I do any validation in here before I enter the
  // React UI loop?
  fastRender(
    <App args={args} renderFunc={props => <TruffleFlow {...props} /> }/>
  )
}