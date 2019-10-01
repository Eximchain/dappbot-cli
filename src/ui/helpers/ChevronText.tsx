import React, { FC } from 'react';
import { Text, TextProps, Box } from 'ink';

export interface ChevronTextProps extends TextProps {
  indent?: number
}
export const ChevronText:FC<ChevronTextProps> = ({ children, indent, ...otherProps }) => {
  const text = <Text {...otherProps}>{'» '}{ children }</Text>;
  if (typeof indent === 'number') {
    return <Box marginLeft={indent * 2}>{text}</Box>
  } else return text;
}

export default ChevronText