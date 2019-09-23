import React, { FC } from 'react';
import { Box } from 'ink';

export const BoxPads:FC = (props) => {
  return (
    <>
    <Box height={1} />
    { props.children }
    <Box height={1} />
    </>
  )
}

export default BoxPads;