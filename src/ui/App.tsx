import React, { useState, PropsWithChildren, ReactElement, useEffect } from 'react';
import path from 'path';
import fs from 'fs';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { newAuthData, AuthData } from '@eximchain/dappbot-types/spec/user';
import { ArgShape, AdditionalArgs, npmPackage } from '../cli';
import { Loader } from './helpers';
import { RequestProvider } from 'react-request-hook';
import axios from 'axios';
import { analytics } from '../services/util';

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

function AppWithoutProvider<Additional extends AdditionalArgs>(props: AppProps<Additional>): ReactElement {
  const { args, renderFunc } = props;
  const initialAuth: AuthData = args.authFile ? JSON.parse(args.authFile) : newAuthData();
  const [authData, setAuthData] = useState(initialAuth);

  const API = new DappbotAPI({
    authData,
    setAuthData: (auth) => {
      if (args.authPath) {
        fs.writeFileSync(path.resolve(process.cwd(), args.authPath), JSON.stringify(auth, null, 2));
      }
      setAuthData(auth);
    },
    dappbotUrl: args.apiUrl
  })

  useEffect(function refreshIfStale() {
    if (API.hasStaleAuth()) API.refreshAuth()
    analytics.identify({
      userId: authData.User.Email,
      traits: {
        cliVersion: npmPackage.version,
        apiUrl: args.apiUrl
      }
    })
  }, [API, authData])

  return API.hasStaleAuth() ? (
    <Loader message='Refreshing your authData...' />
  ) : (
      renderFunc({
        API, authData, setAuthData, args
      })
    )
}

export function App<Additional extends AdditionalArgs>(props: AppProps<Additional>): ReactElement {
  return (
    <RequestProvider value={axios}>
      <AppWithoutProvider {...props} />
    </RequestProvider>
  )
}

export default App;