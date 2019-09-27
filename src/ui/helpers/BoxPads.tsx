import React, { FC } from 'react';
import { Box } from 'ink';

export const BoxPads: FC = (props) => {
  return (
    <Box marginLeft={1}>
      <Box paddingY={1}>
      {props.children}
      </Box>
    </Box>
  )
}

export default BoxPads;