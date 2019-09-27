import React, { FC } from 'react';
import { Box, Text } from 'ink';

export const TextBox:FC = ({ children }) => {
  return (
    <Box>
      <Text>
        { children }
      </Text>
    </Box>
  )
}

export default TextBox;