import React, { FC } from 'react';
import { Box, Text, Static, Color } from 'ink';
import { BoxPads } from '.';
import { isMessageResult } from '@eximchain/dappbot-types/spec/responses';

export interface SuccessBoxProps {
  result: any
  operation?: string
  permanent?: boolean
}

export const SuccessBox: FC<SuccessBoxProps> = ({ result, permanent, operation }) => {
  let content = null;
  if (isMessageResult(result)) {
    content = result.message;
  } else {
    content = `${operation || "Result below:"}\n\n`+JSON.stringify(result, null, 2);
  }
  let body = (
    <Box marginTop={1}>
    <BoxPads key='errorBox'>
      <Color bgHex='#208E00' white>
        <Text bold>{' SUCCESS '}</Text>
      </Color>
      {' '}
      {content}
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

export default SuccessBox;