import React, { FC, useState } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';

import CreateOrUpdate from './Stage1-CreateOrUpdate';
import SelectArtifact from './Stage2-SelectArtifact';
import SelectNetwork from './Stage3-SelectNetwork';
import SetDappName from './Stage4-SetDappName';
import ConfirmDapp from './Stage5-ConfirmDapp';
import { XOR } from 'ts-xor';
import Dapp from '@eximchain/dappbot-types/spec/dapp';
import { TruffleArtifact } from '../../services/util';
import { ArgShape } from '../../cli';

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

  if (isUpdate === null) return (
    <CreateOrUpdate {...{ API, authFile, setIsUpdate, setDappName }} />
  )

  if (artifact === null) return (
    <SelectArtifact {...{ setArtifact, artifacts }} />
  )

  if (Web3URL === '' || ContractAddr === '') return (
    <SelectNetwork {...{ artifact, setWeb3URL, setContractAddr }} />
  )

  if (DappName === '') return (
    <SetDappName {...{ API, setDappName, artifact }} />
  )

  return (
    <ConfirmDapp {...{ API, isUpdate, artifact, Web3URL, DappName, ContractAddr }} />
  )
}

export default TruffleFlow;