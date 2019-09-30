import React, { FC, useState } from 'react';
import { XOR } from 'ts-xor';
import DappbotAPI from '@eximchain/dappbot-api-client';

import { TruffleArtifact } from '../../services/util';

import CreateOrUpdate from './Stage1-CreateOrUpdate';
import SelectArtifact from './Stage2-SelectArtifact';
import SelectNetwork from './Stage3-SelectNetwork';
import SetDappName from './Stage4-SetDappName';
import ConfirmDapp from './Stage5-ConfirmDapp';

export interface TruffleFlowProps {
  API: DappbotAPI
  artifacts: TruffleArtifact[]
  authFile: string
}

export const TruffleFlow:FC<TruffleFlowProps> = (props) => {
  const { API, artifacts, authFile } = props;
  const [isUpdate, setIsUpdate] = useState(null as XOR<null, boolean>);
  const [artifact, setArtifact] = useState(null as XOR<null, TruffleArtifact>);
  const [Web3URL, setWeb3URL] = useState('');
  const [ContractAddr, setContractAddr] = useState('');
  const [DappName, setDappName] = useState('');

  const [progressMsgs, setProgressMsgs] = useState([] as string[]);
  function addProgressMsg(msg:string) {
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

  if (Web3URL === '' || ContractAddr === '') return (
    <SelectNetwork {...{ artifact, setWeb3URL, setContractAddr, addProgressMsg, progressMsgs }} />
  )

  if (DappName === '') return (
    <SetDappName {...{ API, setDappName, artifact, progressMsgs }} />
  )

  return (
    <ConfirmDapp {...{ API, isUpdate, artifact, Web3URL, DappName, ContractAddr, startOver }} />
  )
}

export default TruffleFlow;