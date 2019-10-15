import React, { FC, useState, useEffect } from 'react';
import path from 'path';
import fs from 'fs';
import { useResource } from 'react-request-hook';
import DappbotAPI from '@eximchain/dappbot-api-client';
import ArgPrompt from './helpers/ArgPrompt';
import Responses from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';
import { Loader, errMsgFromResource, SuccessBox, ErrorBox, ChevronText } from './helpers';
import { analytics, standardTrackProps } from '../services/util';
import { DEFAULT_DATA_PATH } from '../cli';

export interface LoginFlowProps {
  API: DappbotAPI
}

export const LoginFlow: FC<LoginFlowProps> = ({ API }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dataPath, setDataPath] = useState(DEFAULT_DATA_PATH);
  const [loginResult, requestLogin] = useResource(API.auth.login.resource);
  const { data, isLoading, error } = loginResult;


  useEffect(function handleLoginResponse() {
    if (
      Responses.isSuccessResponse(data) &&
      User.isAuthData(data.data)
    ) {
      analytics.track({
        event: 'User Login - CLI',
        userId: data.data.User.Email,
        properties: {
          ...standardTrackProps(API),
          // Manually setting email because we do not
          // expect the API to already have valid auth
          // within this flow.
          email: data.data.User.Email,
          isRefresh: false
        }
      })
      const authData = data.data;
      const authPath = path.resolve(process.cwd(), dataPath);
      fs.writeFileSync(authPath, JSON.stringify(authData, null, 2));
    }
  }, [data, dataPath])

  let credentialsLabel = <ChevronText>Please enter your login credentials.</ChevronText>;
  if (username === '') {
    return (
      <ArgPrompt name='email'
        key='emailPrompt'
        label={credentialsLabel}
        withResult={setUsername} />
    )
  } else if (password === '') {
    return (
      <ArgPrompt name='password' hideVal
        label={credentialsLabel}
        key='passwordPrompt'
        withResult={setPassword} />
    )
  } else if (!isLoading && !data && !error) {
    return (
      <ArgPrompt name='Path for auth data'
        defaultValue={DEFAULT_DATA_PATH}
        isValid={val => val.endsWith('.json') ? null : 'Path must end in .json'}
        label={
          <ChevronText>Where would you like to keep your authData file?  If you put it in the default location, DappBot will automatically read it without having to provide an option.</ChevronText>
        }
        withResult={(val) => {
          setDataPath(val);
          requestLogin({ username, password })
        }} />
    )
  } else if (isLoading) {
    return (
      <Loader message={"Logging you into DappBot..."} />
    )
  } else if (error) {
    return (
      <ErrorBox errMsg={errMsgFromResource(error)} permanent />
    )
  } else {
    let followonMsg = dataPath === DEFAULT_DATA_PATH ?
      `Your auth data will be automatically inferred from ${dataPath} for private commands.` :
      `Please include the authPath option (e.g. $ dappbot --authPath ${dataPath} ...) for private commands.`
    
    return (
      <SuccessBox permanent result={{
        message: `You are now logged in! ${followonMsg}`
      }} />
    )
  }
}

export default LoginFlow;