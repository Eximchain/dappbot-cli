import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ArgPrompt, ErrorBox, Loader, ChevronText } from '../helpers';
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
      label={<ChevronText>Please create a new password which has at least 8 characters, including upcase, locase, a number, &amp; a symbol.</ChevronText>}
      name='New Password'
      key='newPassPrompt'
      withResult={setNewPass} />
  )

  if (confirmPass === '') return (
    <ArgPrompt hideVal
      label={<ChevronText>Please confirm your new password; this must match the previous value.</ChevronText>}
      name='New Password'
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
          setNewPass('');
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