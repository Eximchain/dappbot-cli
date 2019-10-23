import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ArgPrompt, ErrorBox, Loader, ChevronText } from '../helpers';
import { Payment } from '@eximchain/dappbot-types/spec/methods';
import Responses from '@eximchain/dappbot-types/spec/responses';
import { trackSignup } from '../../services';

export interface CreateAccountProps {
  API: DappbotAPI
  setEmail: (email: string) => void
}

export const CreateAccount: FC<CreateAccountProps> = ({ API, setEmail }) => {
  const [email, setEmailState] = useState('');
  const [name, setName] = useState('');
  const [organization, setOrganization] = useState('');
  const [occupation, setOccupation] = useState('');

  const [signupResponse, requestSignup] = useResource(API.payment.signUp.resource);
  const { data, isLoading, error } = signupResponse;
  const [localErr, setLocalErr] = useState(null as any);
  useEffect(function handleResponse() {
    if (Responses.isSuccessResponse(data)) {
      setEmail(email);
      trackSignup(API, email, { name, organization, occupation });
    } else {
      setLocalErr(data);
    }
  }, [data, isLoading, error])

  if (email === '') return (
    <ArgPrompt name='Email'
      label={<ChevronText>What email would you like to use?  This will be your username.</ChevronText>}
      withResult={setEmailState}
      key='emailPrompt' />
  )

  if (name === '') return (
    <ArgPrompt name='Name'
      label={<ChevronText>What is your name?</ChevronText>}
      withResult={(nameVal) => {
        setName(nameVal);
      }}
      key='namePrompt' />
  )

  if (organization === '') return (
    <ArgPrompt name='Organization'
      label={[
        <ChevronText key='org-q'>What organization are you working with?  If you're working alone, please enter "Self".</ChevronText>,
        <ChevronText key='org-optional'>This is optional, but we are curious.</ChevronText>
      ]}
      withResult={(orgVal) => {
        // This value needs to not be an empty string in order
        // to progress within the flow.
        let chosenVal = orgVal !== '' ? orgVal : 'N/A';
        setOrganization(chosenVal);
      }}
      key='orgPrompt' />
  )

  if (occupation === '') return (
    <ArgPrompt name='Occupation'
      label={[
        <ChevronText key='occupation-q'>What is your occupation?</ChevronText>,
        <ChevronText key='occupation-optional'>This is also optional, although we are still curious.</ChevronText>
      ]}
      withResult={(occupationVal) => {
        let chosenVal = occupationVal !== '' ? occupationVal : 'N/A';
        setOccupation(chosenVal);
        requestSignup({
          email, name,
          plans: Payment.trialStripePlan()
        })
      }}
      key='occupationPrompt' />
  )

  return error || localErr ? (
    <ErrorBox permanent errMsg={error ? error.data.err.message : JSON.stringify(localErr, null, 2)} />
  ) : (
    <Loader message={"Creating your trial account..."} />
  )
}

export default CreateAccount;