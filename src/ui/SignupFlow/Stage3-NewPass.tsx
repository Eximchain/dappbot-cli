import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ArgPrompt, ErrorBox, Loader } from '../helpers';
import { isSuccessResponse } from '@eximchain/dappbot-types/spec/responses';

export interface StageNewPassProps {
  API: DappbotAPI
  email: string
  session: string
  setPass: (newPass:string) => void
}

export const StageNewPass: FC<StageNewPassProps> = ({ API, email, session, setPass }) => {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  const [newPassResponse, requestNewPass] = useResource(API.auth.newPassword.resource);
  const { isLoading, data, error } = newPassResponse;
  useEffect(function handleResponse(){
    if (isSuccessResponse(data)) {
      setPass(confirmPass);
    }
  }, [isLoading, data, error])

  // TODO: Add validation

  if (newPass === '') return (
    <ArgPrompt hideVal
      name='New Password (Minimum 8 characters including upcase, locase, number, &amp; symbol)'
      key='newPassPrompt'
      withResult={setNewPass} />
  )

  if (confirmPass === '') return (
    <ArgPrompt hideVal
      name='Confirm New Password (must match previous value)'
      key='confirmPassPrompt' 
      withResult={(confirmInput)=>{
        if (confirmInput === newPass) {
          setConfirmPass(confirmInput);
          requestNewPass({
            session,
            username: email,
            newPassword: confirmInput
          })
        } else {
          // How do I signal an error?
        }
      }}/>
  )

  return error ? (
    <ErrorBox permanent errMsg={error.data.err.message} />
  ) : (
    <Loader message={"Replacing your temporary password..."} />
  )
}

export default StageNewPass;