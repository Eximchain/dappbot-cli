import React, { FC, useEffect, useState } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ErrorBox, Loader, ChevronText, Rows, SuccessLabel } from '../helpers';
import { isSuccessResponse } from '@eximchain/dappbot-types/spec/responses';
import { isAuthData } from '@eximchain/dappbot-types/spec/user';
import { Static, Text } from 'ink';
import { trackLogin, saveAuthToFile } from '../../services';

export interface StageFinalLoginProps {
  API: DappbotAPI
  email: string
  pass: string
}

export const StageFinalLogin: FC<StageFinalLoginProps> = ({ API, email, pass }) => {
  const [loginResponse, requestLogin] = useResource(API.auth.login.resource);
  const { isLoading, data, error } = loginResponse;
  const [writeComplete, setWriteComplete] = useState(false);

  useEffect(function requestLoginOnLoad(){
    requestLogin({
      username: email,
      password: pass
    })
  }, [])

  useEffect(function handleResponse(){
    if (!(isSuccessResponse(data) && isAuthData(data.data))) return;
    let authData = data.data;
    saveAuthToFile(authData);
    setWriteComplete(true);
    trackLogin(API, false);
  }, [isLoading, data, error])

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
    <Loader message={`Completing your login...`} />
  )
}

export default StageFinalLogin;