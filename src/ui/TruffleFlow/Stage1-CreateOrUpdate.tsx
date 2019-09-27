import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { Loader, ErrorBox, errMsgFromResource, ApiMethodLabel, TextBox, SuccessBox } from '../helpers';
import SelectInput from 'ink-select-input';
import { useResource } from 'react-request-hook';
import { ListDapps } from '@eximchain/dappbot-types/spec/methods/private';
import { isSuccessResponse } from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';
import { XOR } from 'ts-xor';
import Dapp from '@eximchain/dappbot-types/spec/dapp';

export interface StageCreateOrUpdateProps {
  API: DappbotAPI
  authFile: string
  setIsUpdate: (isLoading: boolean) => void;
  setDappName: (DappName: string) => void;
}

interface SelectUpdateProps {
  dapps: Dapp.Item.Api[]
  setIsUpdate: (isLoading: boolean) => void;
  setDappName: (DappName: string) => void;
}

const SelectDappToUpdate: FC<SelectUpdateProps> = ({ dapps, setIsUpdate, setDappName }) => {
  return (
    <SelectInput
      items={dapps.map(dapp => ({
        label: dapp.DappName,
        value: dapp.DappName
      }))}
      onSelect={item => {
        setDappName(item.label);
        setIsUpdate(true);
      }} />
  )
}

export const StageCreateOrUpdate: FC<StageCreateOrUpdateProps> = ({ API, setIsUpdate, authFile, setDappName }) => {
  const authData: User.AuthData = JSON.parse(authFile);

  const [wantUpdate, setWantUpdate] = useState(null as XOR<null, boolean>);
  const [dappList, fetchDappList] = useResource(API.private.listDapps.resource);
  const { data, error } = dappList;

  useEffect(function fetchOnMount() {
    fetchDappList();
  }, [])

  useEffect(function handleResult() {
    if (data && isSuccessResponse(data) && data.data.count === 0) {
      setIsUpdate(false);
    }
  }, [data])

  if (error) return (
    <ErrorBox permanent
      operation={ApiMethodLabel(ListDapps.HTTP, ListDapps.Path)}
      errMsg={errMsgFromResource(error)} />
  )

  if (data && isSuccessResponse(data)) {
    const dapps = data.data.items;

    // User is good to create a Dapp
    if (dapps.length === 0) return <SuccessBox result={"You're able to create a new Dapp!"} />

    const allowedDapps = parseInt(authData.User.UserAttributes["custom:standard_limit"]) as number;

    // User needs to select which Dapp they want to update
    if (dapps.length === allowedDapps) return (
      <SelectDappToUpdate {...{ dapps, setIsUpdate, setDappName }} />
    )

    // User can decide whether they want to update a dapp or create a new one
    if (wantUpdate === null) return (
      <SelectInput
        items={[
          { label: 'Create', value: 'Create' },
          { label: 'Update', value: 'Update' }
        ]}
        onSelect={item => {
          if (item.value === 'Update') {
            setWantUpdate(true);
          } else {
            setIsUpdate(false);
          }
        }} />
    )

    // User has said they want to update, showing them the update prompt
    return (
      <SelectDappToUpdate {...{ dapps, setIsUpdate, setDappName }} />
    )

  }

  return (
    <Loader message={"Checking how many Dapps you have..."} />
  )
}

export default StageCreateOrUpdate;