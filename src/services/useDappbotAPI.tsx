import { useState } from 'react';
import User from '@eximchain/dappbot-types/spec/user';
import DappbotAPI, { API } from '@eximchain/dappbot-api-client';

export function useDappbotAPI(dappbotUrl:string='https://staging.dapp.bot'):[API, User.AuthData, (newUser:User.AuthData)=>void] {
  const [authData, setAuthData] = useState(User.newAuthData());
  const API = new DappbotAPI({
    authData, setAuthData, dappbotUrl
  })
  return [API, authData, setAuthData];
}

export default useDappbotAPI;