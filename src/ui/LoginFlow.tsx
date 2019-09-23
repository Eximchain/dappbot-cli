import React, { FC, useState, useEffect } from 'react';
import path from 'path';
import fs from 'fs';
import Spinner from 'ink-spinner';
import DappbotAPI from '@eximchain/dappbot-api-client';
import ArgPrompt from './helpers/ArgPrompt';
import Responses from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';
import { BoxPads, TextBox } from './helpers';
import { Box, Text, Static } from 'ink';
import { DEFAULT_DATA_PATH } from '../cli';

export interface LoginFlowProps {
  API: DappbotAPI
}

export enum LoginFlowStages {
  email = 'email',
  password = 'password',
  path = 'path',
  loading = 'loading',
  complete = 'complete'
}

export const LoginFlow: FC<LoginFlowProps> = ({ API }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dataPath, setDataPath] = useState(DEFAULT_DATA_PATH);
  const [stage, setStage] = useState(LoginFlowStages.email);

  useEffect(function makeLoginRequest(){
    if (stage !== LoginFlowStages.loading) return;
    API.auth.login.call({ username, password })
      .then(function writeToFile(response) {
        if (Responses.isSuccessResponse(response) && User.isAuthData(response.data)) {
          const authData = response.data;
          const authPath = path.resolve(process.cwd(), dataPath);
          fs.writeFileSync(authPath, JSON.stringify(authData, null, 2));
          setStage(LoginFlowStages.complete);
        };
      })
      .catch((err) => {
        console.log('Error making request: ');
        console.log(JSON.stringify(err, null, 2));
        process.exit(1);
      })
  }, [stage])

  if (stage === LoginFlowStages.email) {
    return (
      <ArgPrompt name='email' 
        initialValue='' 
        key='emailPrompt'
        withResult={(val)=>{
          setUsername(val);
          setStage(LoginFlowStages.password)
        }}/>
    )
  } else if (stage === LoginFlowStages.password) {
    return (
      <ArgPrompt name='password' 
        hideVal={true}
        initialValue=''
        key='passwordPrompt'
        withResult={(val)=>{
          setPassword(val);
          setStage(LoginFlowStages.path);
        }}/>
    )
  } else if (stage === LoginFlowStages.path) {
    return (
      <ArgPrompt name='Path for auth data' 
        isDefault={true}
        initialValue='./dappbotAuthData.json'
        withResult={(val) => {
          setDataPath(val);
          setStage(LoginFlowStages.loading);
        }} />
    )
  } else if (stage === LoginFlowStages.loading) {
    return (
      <BoxPads>
        <Box marginLeft={1}>
          <Spinner type='dots' />
        </Box>
        <Text>Logging you into DappBot...</Text>
      </BoxPads>
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