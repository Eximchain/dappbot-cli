import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';

import CreateAccount from './Stage1-CreateAccount';
import InitialLogin from './Stage2-InitialLogin';
import NewPass from './Stage3-NewPass';
import FinalLogin from './Stage4-FinalLogin';

export interface SignupFlowProps {
  API: DappbotAPI
}

export const SignupFlow: FC<SignupFlowProps> = ({ API }) => {
  const [confirmedEmail, setConfirmedEmail] = useState('');
  const [session, setSession] = useState('');
  const [confirmedPass, setConfirmedPass] = useState('');

  if (confirmedEmail === '') return (
    <CreateAccount API={API} setEmail={setConfirmedEmail} />
  )

  if (session === '') return (
    <InitialLogin API={API} email={confirmedEmail} setSession={setSession} />
  )

  if (confirmedPass === '') return (
    <NewPass API={API} session={session} email={confirmedEmail} setPass={setConfirmedPass} />
  )

  return (
    <FinalLogin API={API} email={confirmedEmail} pass={confirmedPass} />
  )
}