import React, { useState, PropsWithChildren, ReactElement, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { AuthData } from '@eximchain/dappbot-types/spec/user';
import { ArgShape, AdditionalArgs } from '../cli';
import { Loader } from './helpers';
import { RequestProvider } from 'react-request-hook';
import axios from 'axios';
import { trackLogin, saveAuthToFile } from '../services';

export type RenderFuncProps<Additional extends AdditionalArgs = AdditionalArgs> = (props: {
  API: DappbotAPI
  authData: AuthData
  setAuthData: (newAuthData: AuthData) => void
  args: ArgShape<Additional>
}) => React.ReactElement;

export type AppProps<Additional extends AdditionalArgs> = PropsWithChildren<{
  args: ArgShape<Additional>
  renderFunc: RenderFuncProps<Additional>
}>

export default App;

export function App<Additional extends AdditionalArgs>(props: AppProps<Additional>): ReactElement {
  return (
    <RequestProvider value={axios}>
      <AppWithoutProvider {...props} />
    </RequestProvider>
  )
}

function AppWithoutProvider<Additional extends AdditionalArgs>(props: AppProps<Additional>): ReactElement {
  const { args, renderFunc } = props;
  const [authData, setAuthData] = useState(JSON.parse(args.authFile as string));

  const API = new DappbotAPI({
    authData,
    setAuthData: (auth) => {
      setAuthData(auth);
      saveAuthToFile(auth);
    },
    dappbotUrl: args.apiUrl
  })

  useEffect(function refreshIfStale() {
    if (API.hasStaleAuth()) {
      API.refreshAuth()
      trackLogin(API, true);
    }
  }, [API, authData])

  return API.hasStaleAuth() ? (
    <Loader message='Refreshing your authData...' />
  ) : (
      renderFunc({
        API, authData, setAuthData, args
      })
    )
}