import React, { FC } from 'react';
import { Color, Text } from 'ink';
import figures from 'figures';

export const SuccessLabel:FC = () => (
  <Color bgHex='#208E00' white>
    <Text bold>{` ${figures.tick} SUCCESS `}</Text>
  </Color>
)

export default SuccessLabel;