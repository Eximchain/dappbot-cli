import React from 'react';
import { render } from "ink";
import { ArgShape } from "../cli";
import { App, LoginFlow } from '../ui';


export const command = 'login';

export const desc = 'Interactive command to begin a persistent session with DappBot.';

export const builder = {}

export function handler(args:ArgShape) {
  render(
    <App args={args} renderFunc={(props) => <LoginFlow {...props} />}/>
  )
}