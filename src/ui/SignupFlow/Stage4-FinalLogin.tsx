import React, { FC, useEffect, useState } from 'react';
import fs from 'fs';
import path from 'path';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ArgPrompt, ErrorBox, Loader, TextBox, ChevronText, Rows, SuccessBox, SuccessLabel } from '../helpers';
import { isSuccessResponse } from '@eximchain/dappbot-types/spec/responses';
import { isAuthData } from '@eximchain/dappbot-types/spec/user';
import { DEFAULT_DATA_PATH } from '../../cli';
import { Static, Box, Text } from 'ink';

export interface StageFinalLoginProps {
  API: DappbotAPI
  email: string
  pass: string
}

export const StageFinalLogin: FC<StageFinalLoginProps> = ({ API, email, pass }) => {
  const [authPath, setAuthPath] = useState('');
  const [loginResponse, requestLogin] = useResource(API.auth.login.resource);
  const { isLoading, data, error } = loginResponse;
  const [writeComplete, setWriteComplete] = useState(false);

  useEffect(function handleResponse(){
    if (!(isSuccessResponse(data) && isAuthData(data.data))) return;
    let authData = data.data;
    fs.writeFileSync(path.resolve(process.cwd(), authPath), JSON.stringify(authData, null, 2))
    setWriteComplete(true);
  }, [isLoading, data, error, authPath])

  if (authPath === '') {
    return (
      <ArgPrompt name='Path for authData'
        label={<ChevronText>Which file would you like to keep your authData in?  If you put it in the default location, DappBot will automatically read it without having to provide an option.</ChevronText>}
        defaultValue={DEFAULT_DATA_PATH}
        withResult={(val) => {
          setAuthPath(path.normalize(val)) 
          requestLogin({
            username: email,
            password: pass
          })
        }} />
    )
  }

  if (error) return (
    <ErrorBox permanent errMsg={error.data.err.message} />
  )

  return writeComplete && !isLoading ? (
    <Static>
      <Rows>
        <Text><SuccessLabel />{' '}Your account is all ready to go!  You can start using DappBot right now.</Text>
        <ChevronText>
          Run <Text underline>dappbot truffle</Text> from a Truffle project directory to make a dapp for a deployed contract.
        </ChevronText>
        <ChevronText>
          Run <Text underline>dappbot login</Text> from any directory to authenticate as <Text underline>{email}</Text> and run private commands.
        </ChevronText>
        <ChevronText>
          Run <Text underline>dappbot api</Text> to see all the available API commands.
        </ChevronText>
        <ChevronText>
          Run <Text underline>dappbot</Text> to see the high-level usage info.
        </ChevronText>
      </Rows>
      <></>
    </Static>
  ) : (
    <Loader message={`Completing your login and saving the auth data to ${path.normalize(authPath)} ...`} />
  )
}

export default StageFinalLogin;