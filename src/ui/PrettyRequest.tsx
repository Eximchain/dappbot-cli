import React, { FC, useEffect } from 'react';
import { Resource, useResource } from 'react-request-hook';
import { isSuccessResponse } from '@eximchain/dappbot-types/spec/responses';
import { Loader, ErrorBox, SuccessBox, errMsgFromResource } from './helpers';

export interface PrettyRequestProps<ResponseType = any> {
  resource: () => Resource<ResponseType>
  onSuccess?: (response: ResponseType) => void
  operation?: string
}

export const PrettyRequest: FC<PrettyRequestProps> = ({ resource: req, onSuccess: onComplete, operation }) => {
  const [response, request] = useResource(req);
  const { isLoading, data, error } = response;

  useEffect(function callOnStart() {
    request();
  }, [])

  useEffect(function handleSuccess() {
    if (isSuccessResponse(data) && onComplete) {
      onComplete(data.data);
    }
  }, [data])

  if (isLoading || (!data && !error)) {
    return (
      <Loader message="Your request is in the air..." />
    )
  }

  return error ? (
    <ErrorBox permanent
      errMsg={errMsgFromResource(error)}
      operation={operation} />
  ) : (
    <SuccessBox permanent
      result={data.data}
      operation={operation} />
  )
}