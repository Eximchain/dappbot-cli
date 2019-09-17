import React, { FC, useState, cloneElement } from 'react';
import API from '@eximchain/dappbot-api-client';
import useDappbotAPI from '../services/useDappbotAPI';
import User from '@eximchain/dappbot-types/spec/user';
import { Argv } from 'yargs';

interface GUIBaseProps {
  argv:Argv<any>
  render:(props:GUIBaseRenderProps) => React.ReactElement
}

interface GUIBaseRenderProps {
  API: API
  authData : User.AuthData
  setAuthData : (newAuthData:User.AuthData) => void
  argv: Argv<any>
}

export const GUIBase:FC<GUIBaseProps> = ({argv, render}) => {
  // TODO: Once we add options for loading auth data from
  // a file, this component will perform that operation
  // transparently so that if auth was specified, children
  // can assume they have it.
  const [API, authData, setAuthData] = useDappbotAPI();
  return render({
    API, authData, setAuthData, argv
  });
}

export default GUIBase;
