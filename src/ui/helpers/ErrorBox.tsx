import React, { FC } from 'react';
import { Box, Text, Static, Color } from 'ink';
import { BoxPads } from '.';

export interface ErrorBoxProps {
  errMsg: string
  operation?: string
  permanent?: boolean
}

export const ErrorBox: FC<ErrorBoxProps> = ({ errMsg: message, permanent, operation }) => {
  let body = (
    <Box marginTop={1}>
    <BoxPads key='errorBox'>
      <Color bgHex='#AF3609' white>
        <Text bold>{' ERROR '}</Text>
      </Color>
      {' '}
      { operation ? `${operation}: ` : ''}
      {message}
    </BoxPads>
    </Box>
  )
  return permanent ? (
    <Static>
      { body }
      <></>
    </Static>
  ) : body ;
}

export default ErrorBox;