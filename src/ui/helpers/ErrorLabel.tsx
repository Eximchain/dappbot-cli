import React, { FC } from 'react';
import { Color, Text } from 'ink';
import figures from 'figures';

interface ErrorLabelProps {
  errorType?: string
}
export const ErrorLabel:FC<ErrorLabelProps> = (props) => {
  let msg = props.errorType ? `${props.errorType.toUpperCase()} ERROR` : 'ERROR';
  return (
    <Color bgHex='#AF3609' white>
      <Text bold>{` ${figures.cross} ${msg} `}</Text>
    </Color>
  )
}

export default ErrorLabel;