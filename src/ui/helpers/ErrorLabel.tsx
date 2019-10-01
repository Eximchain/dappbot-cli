import React, { FC } from 'react';
import { Color, Text } from 'ink';
import figures from 'figures';

export const ErrorLabel:FC = () => (
  <Color bgHex='#AF3609' white>
    <Text bold>{` ${figures.cross} ERROR `}</Text>
  </Color>
)

export default ErrorLabel;