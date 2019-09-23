import React, { useState, PropsWithChildren, ReactElement, useEffect } from 'react';
import fs from 'fs';
import { Text } from 'ink';
import DappbotAPI from '@eximchain/dappbot-api-client';
import User from '@eximchain/dappbot-types/spec/user';
import { ArgShape, AdditionalArgs } from '../cli';
import { PrettyRequest, BoxPads } from './helpers';
import Spinner from 'ink-spinner';
import Responses from '@eximchain/dappbot-types/spec/responses';

export type RenderFuncProps<Additional extends AdditionalArgs = AdditionalArgs> = (props:{
  API: DappbotAPI
  authData : User.AuthData
  setAuthData : (newAuthData:User.AuthData) => void
  args: ArgShape<Additional>
}) => React.ReactElement;

export type AppProps<Additional extends AdditionalArgs> = PropsWithChildren<{
  args:ArgShape<Additional>
  renderFunc:RenderFuncProps<Additional>
}>

export function App<Additional extends AdditionalArgs>(props:AppProps<Additional>):ReactElement {
  const { args, renderFunc } = props;
  const initialAuth:User.AuthData = args.authFile ? JSON.parse(args.authFile) : User.newAuthData();
  const [authData, setAuthData] = useState(initialAuth);
  const API = new DappbotAPI({
    authData, setAuthData, 
    dappbotUrl:'https://cli-api.eximchain-dev.com'
  })

  useEffect(function refreshAuth(){
    if (!API.hasStaleAuth()) return;
    API.auth.refresh.call({ refreshToken : initialAuth.RefreshToken })
      .then((authRes) => {
        if (
          Responses.isSuccessResponse(authRes) &&
          User.isAuthData(authRes.data)
        ) {
          if (args.authPath) {
            fs.writeFileSync(args.authPath, JSON.stringify(authRes.data, null, 2))
          }
          setAuthData(authRes.data);
        }
      })
  }, [API])

  if (API.hasStaleAuth()) {
    return (
      <BoxPads>
        <Spinner type='dots' />
        <Text>Refreshing your authData...</Text>
      </BoxPads>
    )
  } else {
    return renderFunc({
      API, authData, setAuthData, args : args
    });
  }
}

export default App;