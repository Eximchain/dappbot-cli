import React, { FC, useState, useEffect } from 'react';
import { Text, Box } from 'ink';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { useResource } from 'react-request-hook';
import { ListDapps } from '@eximchain/dappbot-types/spec/methods/private';
import { isSuccessResponse } from '@eximchain/dappbot-types/spec/responses';
import User from '@eximchain/dappbot-types/spec/user';
import { XOR } from 'ts-xor';
import Dapp from '@eximchain/dappbot-types/spec/dapp';
import {
  Loader, ErrorBox, errMsgFromResource, ApiMethodLabel, SuccessBox,
  Select, Rows, ChevronText
} from '../helpers';
import { StringElt } from '.';
import { Item } from 'ink-select-input';

export interface StageCreateOrUpdateProps {
  API: DappbotAPI
  authFile: string
  setIsUpdate: (isLoading: boolean) => void;
  setDappName: (DappName: string) => void;
  addProgressMsg: (msg: StringElt) => void
}

interface SelectUpdateProps {
  dapps: Dapp.Item.Api[]
  setIsUpdate: (isLoading: boolean) => void;
  setDappName: (DappName: string) => void;
  label: StringElt[]
  addProgressMsg: (msg: StringElt) => void
}

const SelectDappToUpdate: FC<SelectUpdateProps> = ({ dapps, setIsUpdate, setDappName, label, addProgressMsg }) => {
  const DappItem = (dapp:Dapp.Item.Api) => ({
    label: dapp.DappName,
    value: dapp.DappName
  })
  function selectDapp(item:Item){
    setDappName(item.label);
    addProgressMsg(<ChevronText>Updating the <Text underline>{item.label}</Text> dapp.</ChevronText>);
    setIsUpdate(true);
  }
  useEffect(function autoSelectLoneDapp() {
    if (dapps.length === 1) selectDapp(DappItem(dapps[0]))
  }, [dapps])
  return (
    <Select label={label}
      items={dapps.map(DappItem)}
      onSelect={selectDapp} />
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
        addProgressMsg(<ChevronText key='new-dapp'>You haven't used any of your dapps, creating a new one.</ChevronText>)
      }
      if (currentDapps === allowedDapps && currentDapps === 1) {
        setIsUpdate(true)
        let DappName = data.data.items[0].DappName;
        setDappName(DappName)
        addProgressMsg(
          <ChevronText key='auto-dappname-row'>Automatically updating your only allotted dapp, <Text underline>{DappName}</Text>.</ChevronText>
        )
        addProgressMsg(
          <ChevronText key='dappname-hint' indent={1}>Usage Hint: To create a dapp with a new name, run <Text underline>dappbot api private/deleteDapp {DappName}</Text></ChevronText>
        )
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
            key='forced-update'
            label={[
              <ChevronText key='row1'>You have already created {dapps.length} of the {allowedDapps} dapps in your subscription.</ChevronText>,
              <ChevronText indent={1} key='row2'>Usage Hint: To buy more dapps, run <Text underline>dappbot billing</Text> to visit the billing page.</ChevronText>,
              <ChevronText key='row3'>If you would like to continue by updating one of your existing dapps, which dapp would you like to update?</ChevronText>
            ]} />
        )
      } else {
        return <SuccessBox result={{ message: `Updating your single allotted dapp, ${dapps[0].DappName}` }} />
      }
    }

    // User can decide whether they want to update a dapp or create a new one
    if (wantUpdate === null) return (
      <Select
        key='create-or-update'
        label={[
          <ChevronText key='row1'>You have only created {dapps.length} of the {allowedDapps} dapps in your subscription.</ChevronText>,
          <ChevronText key='row2'>Would you like to create a new dapp, or update one of your existing ones?</ChevronText>
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
            addProgressMsg(<ChevronText key='create-new-dapp'>Creating a new dapp.</ChevronText>);
          }
        }} />
    )

    // User has said they want to update, showing them the update prompt
    return (
      <SelectDappToUpdate {...{ dapps, setIsUpdate, setDappName, addProgressMsg }}
        key='voluntary-update'
        label={[<ChevronText key='which-app-to-update'>Which of your dapps would you like to update?</ChevronText>]} />
    )

  }

  return (
    <Loader message={"Checking how many Dapps you have..."} />
  )
}

export default StageCreateOrUpdate;