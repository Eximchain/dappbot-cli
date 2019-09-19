import React, { FC, useState, useReducer } from 'react';
import { Login } from '@eximchain/dappbot-types/spec/methods/auth';
import { Box, Text, Static } from 'ink';
import { RenderFuncProps } from '../App';
import Responses from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';

export interface LoginFlowProps extends RenderFuncProps<Login.Args> {

}

export const LoginFlow: FC<LoginFlowProps> = (props) => {

  let username = 'not';
  let password = 'working';

  const handleLoginRes = (res:any) => {
    if (
      Responses.isSuccessResponse(res) &&
      User.isAuthData(res.data)
      ) {

    }
  }

  return (
    <Static>
      <Box paddingTop={2}>
        <Text>Under construction</Text>
      </Box>
      <Box>
        <Text>username: {username}</Text>
      </Box>
      <Box paddingBottom={2}>
        <Text>password: {password}</Text>
      </Box>
    </Static>
  )
}

export default LoginFlow;