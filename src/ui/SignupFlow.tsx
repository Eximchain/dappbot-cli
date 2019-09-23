import React, { FC, useState } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { SignUp } from '@eximchain/dappbot-types/spec/methods/payment';
import BoxPads from './helpers/BoxPads';
import { Login } from '@eximchain/dappbot-types/spec/methods/auth';
import { XOR } from 'ts-xor';

export interface SignupFlowProps {
  API: DappbotAPI
}

export enum SignupFlowStages {
  email = 'email',
  name = 'name',
  path = 'path'
}

export const SignupFlow: FC<SignupFlowProps> = ({ API }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loginResponse, setLoginResponse] = useState(null as XOR<Login.Response, null>);
  const [dataPath, setDataPath] = useState('./dappbotAuthData.json');
  return (
    <BoxPads>

    </BoxPads>
  )
}