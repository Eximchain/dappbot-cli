import React, { FC, useState, useEffect } from 'react';
import path from 'path';
import fs from 'fs';
import Spinner from 'ink-spinner';
import { useResource } from 'react-request-hook';
import DappbotAPI from '@eximchain/dappbot-api-client';
import ArgPrompt from './helpers/ArgPrompt';
import Responses from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';
import { BoxPads, TextBox, Loader } from './helpers';
import { Box, Text, Static } from 'ink';
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
  

  useEffect(function handleLoginResponse(){
    if (
      Responses.isSuccessResponse(data) &&
      User.isAuthData(data.data)
    ) {
      const authData = data.data;
      const authPath = path.resolve(process.cwd(), dataPath);
      fs.writeFileSync(authPath, JSON.stringify(authData, null, 2));
    }
  }, [data, dataPath])

  if (username === '') {
    return (
      <ArgPrompt name='email' 
        key='emailPrompt'
        withResult={setUsername}/>
    )
  } else if (password === '') {
    return (
      <ArgPrompt name='password' hideVal
        key='passwordPrompt'
        withResult={setPassword}/>
    )
  } else if (!isLoading && !data && !error) {
    return (
      <ArgPrompt name='Path for auth data' 
        defaultValue={DEFAULT_DATA_PATH}
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
      <Static>
        <BoxPads>
          Error logging you in:
        </BoxPads>
        <Text>
          { JSON.stringify(error.data, null, 2) }
        </Text>
      </Static>
    )
  } else {
    let followonMsg = dataPath === DEFAULT_DATA_PATH ?
    '\n\nYou chose the default --authPath location, so it will be automatically inferred for private commands.' :
    '\n\nPlease include this path (can be relative) on the --authPath option, that way we can infer the Authorization for private requests.'
    return (
      <Static>
        <BoxPads>
          <TextBox>Your login was successful!</TextBox>
        </BoxPads>
        <TextBox>
          You can find your saved authentication data at {path.resolve(process.cwd(), dataPath)}.
          { followonMsg }
        </TextBox>
      </Static>
    )
  }
}

export default LoginFlow;