import React, { FC, useState, useEffect } from 'react';
import { Box, Text, Color, Static } from 'ink';
import Spinner from 'ink-spinner';

export interface PrettyRequestProps<ResponseType=any> {
  req: () => Promise<ResponseType>
  onComplete?: (response:ResponseType) => void
}

export const PrettyRequest:FC<PrettyRequestProps> = ({ req, onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isErr, setIsErr] = useState(false);
  const [result, setResult] = useState(null as any);

  useEffect(function makeRequest(){
    if (isLoading) return;
    if (result === null) {
      req()
        .then((res:any) => {
          setResult(res)
          setIsLoading(false);
        })
        .catch((err:any) => {
          setResult(err)
          setIsLoading(false);
          setIsErr(true);
        })
    } else {
      if (onComplete) {
        onComplete(result);
      }
    }
  }, [isLoading, result])

  if (isLoading) {
    return <Spinner type='dots' />
  }
  if (result === null) {
    return (
      <Text>About to make the request...</Text>
    )
  } else {
    let header = isErr ?
      <Color red>Error:</Color> :
      <Color green>Result:</Color>
    return (
      <Static>
        <Text>{ header }</Text>
        <Box textWrap={"wrap"}>
          <Text>
            { result }
          </Text>
        </Box>
      </Static>
    )
  }
}