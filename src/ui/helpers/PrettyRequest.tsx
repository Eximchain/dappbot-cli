import React, { FC, useState, useEffect } from 'react';
import { Box, Text, Color, Static } from 'ink';
import Spinner from 'ink-spinner';
import BoxPads from './BoxPads';

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
      setIsLoading(true);
      req()
        .then((res:any) => {
          setResult(res)
          setIsLoading(false);
        })
        .catch((err:any) => {
          let { statusCode, body } = err.response;
          let { message } = err;
          console.log('Err message: ',err.message);
          setIsErr(true);
          setResult(err)
          setIsLoading(false);
        })
    } else {
      if (onComplete) {
        onComplete(result);
      }
    }
  }, [isLoading, result])

  if (isLoading) {
    return (
      <BoxPads>
        <Text><Spinner type='dots' />Your request is in the air...</Text>
      </BoxPads>
    )
  }
  if (result === null) {
    return (
      <BoxPads>
        <Text><Spinner type='dots' />About to make the request...</Text>
      </BoxPads>
    )
  }
  let header, resObj;
  if (isErr) {
    header = <Color red>Error: {result.statusCode}</Color>;
    resObj = result;
  } else {
    header = <Color green>Result:</Color>;
    resObj = typeof result === 'string' ? JSON.parse(result) : result;
  }
  return (
    <BoxPads>
      <Static>
      <Box paddingTop={3}>
        <Text>{ header }{'\n'}</Text>
      </Box>
      <Box textWrap='wrap'>
        <Text>
          { JSON.stringify(resObj, null, 2)+'\n' }
        </Text>
      </Box>
    </Static>
    </BoxPads>
  )
}