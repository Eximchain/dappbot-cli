import React, { FC, useState, useEffect } from 'react';
import { TextProps } from 'ink';
import { XOR } from 'ts-xor';
import DappbotAPI from '@eximchain/dappbot-api-client';

import { TruffleArtifact, analytics } from '../../services/util';

import CreateOrUpdate from './Stage1-CreateOrUpdate';
import SelectArtifact from './Stage2-SelectArtifact';
import SelectNetwork from './Stage3-SelectNetwork';
import SetDappName from './Stage4-SetDappName';
import ConfirmDapp from './Stage5-ConfirmDapp';
import PerformRequest from './Stage6-PerformRequest';
import User from '@eximchain/dappbot-types/spec/user';
import { npmPackage } from '../../cli';

export interface TruffleFlowProps {
  API: DappbotAPI
  artifacts: TruffleArtifact[]
  authFile: string
}

export type StringElt = string | ReturnType<FC<TextProps>>;

export const TruffleFlow:FC<TruffleFlowProps> = (props) => {
  const { API, artifacts, authFile } = props;
  
  const [isUpdate, setIsUpdate] = useState(null as XOR<null, boolean>);
  const [artifact, setArtifact] = useState(null as XOR<null, TruffleArtifact>);
  const [Web3URL, setWeb3URL] = useState('');
  const [ContractAddr, setContractAddr] = useState('');
  const [DappName, setDappName] = useState('');

  const [dappConfirmed, setDappConfirmed] = useState(false);
  function confirmDapp(){ setDappConfirmed(true) }

  const [progressMsgs, setProgressMsgs] = useState([] as StringElt[]);
  function addProgressMsg(msg:StringElt) {
    setProgressMsgs(msgs => msgs.concat([msg]))
  }

  function startOver(){
    setIsUpdate(null);
    setArtifact(null);
    setWeb3URL('');
    setContractAddr('');
    setDappName('');
    setProgressMsgs([]);
  }

  if (isUpdate === null) return (
    <CreateOrUpdate {...{ API, authFile, setIsUpdate, setDappName, addProgressMsg }} />
  )

  if (artifact === null) return (
    <SelectArtifact {...{ setArtifact, artifacts, addProgressMsg, progressMsgs }} />
  )

  if (DappName === '') return (
    <SetDappName {...{ API, setDappName, artifact, addProgressMsg, progressMsgs }} />
  )

  if (Web3URL === '' || ContractAddr === '') return (
    <SelectNetwork {...{ artifact, setWeb3URL, setContractAddr, addProgressMsg, progressMsgs }} />
  )

  if (!dappConfirmed) return (
    <ConfirmDapp {...{ 
      isUpdate, artifact, Web3URL, DappName, ContractAddr, startOver, confirmDapp
     }} />
  )

  return (
    <PerformRequest {...{
      API, isUpdate, artifact, Web3URL, DappName, ContractAddr
    }} />
  )
}

export default TruffleFlow;