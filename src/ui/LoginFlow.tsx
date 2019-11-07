import React, { FC, useState, useEffect } from 'react';
import path from 'path';
import fs from 'fs';
import { useResource } from 'react-request-hook';
import DappbotAPI from '@eximchain/dappbot-api-client';
import ArgPrompt from './helpers/ArgPrompt';
import Responses from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';
import { Loader, errMsgFromResource, SuccessBox, ErrorBox, ChevronText } from './helpers';
import { trackLogin, saveAuthToFile } from '../services';

export interface LoginFlowProps {
  API: DappbotAPI
}

export const LoginFlow: FC<LoginFlowProps> = ({ API }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, requestLogin] = useResource(API.auth.login.resource);
  const { data, isLoading, error } = loginResult;


  useEffect(function handleLoginResponse() {
    if (
      Responses.isSuccessResponse(data) &&
      User.isAuthData(data.data)
    ) {
      saveAuthToFile(data.data)
      trackLogin(API, false);
    }
  }, [data])

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
        withResult={(val) => {
          requestLogin({ username, password: val });
          setPassword(val)
        }} />
    )
  } else if (isLoading || (!data && !error)) {
    return (
      <Loader message={"Logging you into DappBot..."} />
    )
  } else if (error) {
    return (
      <ErrorBox errMsg={errMsgFromResource(error)} permanent />
    )
  } else {
    return (
      <SuccessBox permanent result={{
        message: `You are now logged in!`
      }} />
    )
  }
}

export default LoginFlow;