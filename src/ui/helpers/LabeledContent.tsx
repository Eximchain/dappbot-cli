import React, { ReactElement, FC } from 'react';
import { Box } from 'ink';

export interface LabeledContentProps {
  label: string | string[]
  content: ReactElement
}

export const LabeledContent: FC<LabeledContentProps> = ({ label, content }) => {
  const labels = Array.isArray(label) ?
    label.map((eachLabel, i) => (
      <Box key={i} marginBottom={1} flexDirection='row'>{'» '+eachLabel}</Box>
    )) :
    <Box flexDirection='row' marginBottom={1}>{'» '+label}</Box>
  return (
    <Box margin={1} flexDirection='column'>
      {labels}
      <Box key='content' flexDirection='row'>
        {content}
      </Box>
    </Box>
  )
}