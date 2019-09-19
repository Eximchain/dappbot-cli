import React, { FC, useState, cloneElement, PropsWithChildren, ReactElement } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import User from '@eximchain/dappbot-types/spec/user';
import { ArgShape, AdditionalArgs } from '../cli';

export type RenderFuncProps<Additional extends AdditionalArgs = AdditionalArgs> = (props:{
  API: DappbotAPI
  authData : User.AuthData
  setAuthData : (newAuthData:User.AuthData) => void
  opts: ArgShape<Additional>
}) => React.ReactElement;

export type AppProps<Additional extends AdditionalArgs> = PropsWithChildren<{
  args:ArgShape<Additional>
  renderFunc:RenderFuncProps<Additional>
}>

export function App<Additional extends AdditionalArgs>(props:AppProps<Additional>):ReactElement {
  const { args, renderFunc: render } = props;
  const initialAuth = args.authData ? args.authData : User.newAuthData();
  const [authData, setAuthData] = useState(initialAuth);
  const API = new DappbotAPI({
    authData, setAuthData, dappbotUrl:'https://api-type.eximchain-dev.com'
  })
  return render({
    API, authData, setAuthData, opts : args
  });
}

export default App;