import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ListDapps } from '@eximchain/dappbot-types/spec/methods/private';
import { isSuccessResponse } from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';
import { XOR } from 'ts-xor';
import Dapp from '@eximchain/dappbot-types/spec/dapp';
import {
  Loader, ErrorBox, errMsgFromResource, ApiMethodLabel, SuccessBox,
  Select, LabeledContent
} from '../helpers';

export interface StageCreateOrUpdateProps {
  API: DappbotAPI
  authFile: string
  setIsUpdate: (isLoading: boolean) => void;
  setDappName: (DappName: string) => void;
  addProgressMsg: (msg: string) => void
}

interface SelectUpdateProps {
  dapps: Dapp.Item.Api[]
  setIsUpdate: (isLoading: boolean) => void;
  setDappName: (DappName: string) => void;
  label: string | string[]
  addProgressMsg: (msg: string) => void
}

const SelectDappToUpdate: FC<SelectUpdateProps> = ({ dapps, setIsUpdate, setDappName, label, addProgressMsg }) => {
  return (
    <Select label={label}
      items={dapps.map(dapp => ({
        label: dapp.DappName,
        value: dapp.DappName
      }))}
      onSelect={item => {
        setDappName(item.label);
        addProgressMsg(`Updating the ${item.label} dapp.`);
        setIsUpdate(true);
      }} />
  )
}

export const StageCreateOrUpdate: FC<StageCreateOrUpdateProps> = (props) => {
  const { API, setIsUpdate, authFile, setDappName, addProgressMsg } = props;
  const authData: User.AuthData = JSON.parse(authFile);
  const allowedDapps = parseInt(authData.User.UserAttributes["custom:standard_limit"]) as number;

  const [wantUpdate, setWantUpdate] = useState(null as XOR<null, boolean>);
  const [dappList, fetchDappList] = useResource(API.private.listDapps.resource);
  const { data, error } = dappList;

  useEffect(function fetchOnMount() {
    fetchDappList();
  }, [])

  useEffect(function handleResult() {
    if (data && isSuccessResponse(data)) {
      let currentDapps = data.data.count;
      if (currentDapps === 0) {
        setIsUpdate(false);
        addProgressMsg("You haven't used any of your dapps, creating a new one.")
      }
      if (currentDapps === allowedDapps && currentDapps === 1) {
        setIsUpdate(true)
        let DappName = data.data.items[0].DappName;
        setDappName(DappName)
        addProgressMsg(`Automatically updating your only allotted dapp, ${DappName}.  If you would prefer to create one with a different name, first delete this dapp by running:`);
        addProgressMsg(`$ dappbot api private/deleteDapp ${DappName}`)
      }
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
    if (dapps.length === 0) return <SuccessBox result={{ message: "You're able to create a new Dapp!" }} />

    // User needs to select which Dapp they want to update
    if (dapps.length === allowedDapps) {
      if (dapps.length > 1) {
        return (
          <SelectDappToUpdate {...{ dapps, setIsUpdate, setDappName, addProgressMsg }}
            label={[
              `You have already created ${dapps.length} of the ${allowedDapps} dapps in your subscription.  If you would like to buy more dapps, please run "$ dappbot billing"`,
              'If you would like to continue by updating one of your existing dapps, which dapp would you like to update?'
            ]} />
        )
      } else {
        return <SuccessBox result={{ message: `Updating your single allotted dapp, ${dapps[0].DappName}` }} />
      }
    }

    // User can decide whether they want to update a dapp or create a new one
    if (wantUpdate === null) return (
      <Select
        label={[
          `You have only created ${dapps.length} of the ${allowedDapps} dapps in your subscription.`,
          'Would you like to create a new dapp, or update one of your existing ones?'
        ]}
        items={[
          { label: 'Create', value: 'Create' },
          { label: 'Update', value: 'Update' }
        ]}
        onSelect={item => {
          if (item.value === 'Update') {
            setWantUpdate(true);
          } else {
            setIsUpdate(false);
            addProgressMsg("Creating a new dapp.");
          }
        }} />
    )

    // User has said they want to update, showing them the update prompt
    return (
      <SelectDappToUpdate {...{ dapps, setIsUpdate, setDappName, addProgressMsg }}
        label={'Which of your dapps would you like to update?'} />
    )

  }

  return (
    <Loader message={"Checking how many Dapps you have..."} />
  )
}

export default StageCreateOrUpdate;