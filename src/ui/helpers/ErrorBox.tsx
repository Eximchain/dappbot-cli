import React, { FC } from 'react';
import { Box, Text, Static, Color } from 'ink';
import { BoxPads, ErrorLabel } from '.';

export interface ErrorBoxProps {
  errMsg: string
  operation?: string
  permanent?: boolean
}

export const ErrorBox: FC<ErrorBoxProps> = ({ errMsg: message, permanent, operation }) => {
  let body = (
    <Box marginTop={1}>
    <BoxPads key='errorBox'>
      <ErrorLabel />
      {' '}
      { operation ? `${operation} ` : ''}
      {message}
    </BoxPads>
    </Box>
  )
  if (permanent !== true) return body;
  return (
    <Static>
      { body }
      <></>
    </Static>
  )
}

export default ErrorBox;