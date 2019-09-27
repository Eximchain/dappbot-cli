import React, { FC } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { BoxPads } from '.'

export interface LoaderProps {
  message: string
}
export const Loader:FC<LoaderProps> = ({ message }) => {
  return (
    <BoxPads>
      <Box marginRight={1}>
        <Spinner type='dots' />
      </Box>
      <Text>{ message }</Text>
    </BoxPads>
  )
}

export default Loader;