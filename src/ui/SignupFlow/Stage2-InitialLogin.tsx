import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ArgPrompt, ErrorBox, Loader, ChevronText } from '../helpers';
import { isSuccessResponse } from '@eximchain/dappbot-types/spec/responses';
import { Challenges } from '@eximchain/dappbot-types/spec/user';

export interface StageInitialLoginProps {
  API: DappbotAPI
  email: string
  setSession: (session:string) => void
}

export const StageInitialLogin: FC<StageInitialLoginProps> = ({ API, email, setSession }) => {
  const [tempPass, setTempPass] = useState('');

  const [loginResponse, requestLogin] = useResource(API.auth.login.resource);
  const { data, isLoading, error } = loginResponse;

  useEffect(function handleResponse(){
    if (isSuccessResponse(data) && Challenges.isData(data.data)) {
      setSession(data.data.Session)
    }
  }, [data, isLoading, error])

  if (tempPass === '') return (
    <ArgPrompt name='Temporary Password'
      label={<ChevronText>We just sent a temporary password to {email}!  Please check your inbox and enter it now.</ChevronText>}
      withResult={(passFromEmail) => {
        setTempPass(passFromEmail);
        requestLogin({
          username: email,
          password: passFromEmail
        })
      }} />
  )

  return error ? (
    <ErrorBox permanent errMsg={error.data.err.message} />
  ) : (
    <Loader message={"Performing your initial login..."} />
  )
}

export default StageInitialLogin;