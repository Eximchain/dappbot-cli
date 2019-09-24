import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ArgPrompt, ErrorBox, Loader } from '../helpers';
import { Payment } from '@eximchain/dappbot-types/spec/methods';
import Responses from '@eximchain/dappbot-types/spec/responses';

export interface CreateAccountProps {
  API: DappbotAPI
  setEmail: (email:string) => void
}

export const CreateAccount: FC<CreateAccountProps> = ({ API, setEmail }) => {
  const [email, setEmailState] = useState('');
  const [name, setName] = useState('');

  const [signupResponse, requestSignup] = useResource(API.payment.signUp.resource);
  const { data, isLoading, error } = signupResponse;
  const [localErr, setLocalErr] = useState(null as any);
  useEffect(function handleResponse(){
    if (Responses.isSuccessResponse(data)) {
      setEmail(email);
    } else {
      setLocalErr(data);
    }
  }, [data, isLoading, error])

  if (email === '') return (
    <ArgPrompt name='Email' 
      withResult={setEmailState}
      key='emailPrompt' />
  )

  if (name === '') return (
    <ArgPrompt name='Name' 
      withResult={(nameVal) => {
        setName(nameVal);
        requestSignup({ 
          email, 
          name: nameVal, 
          plans: Payment.trialStripePlan() })
      }}
      key='namePrompt' />
  )

  return error || localErr ? (
    <ErrorBox permanent errMsg={error ? error.data.err.message : JSON.stringify(localErr, null, 2)} />
  ) : (
    <Loader message={"Creating your trial account..."} />
  )
}

export default CreateAccount;