import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { Loader } from '../helpers';
import { TruffleArtifact } from '../../services/util';

export interface StageConfirmDapp {
  API: DappbotAPI
  isUpdate: boolean
  artifact: TruffleArtifact
  DappName: string
  Web3URL: string
  ContractAddr: string
}

export const StageConfirmDapp: FC<StageConfirmDapp> = (props) => {
  const { DappName, Web3URL, ContractAddr } = props;
  // Display a confirmation including:
  // - DappName
  // - Contract Address
  // - Destination network
  // - Number of functions, including a few samples

  // Perform the request
  return <Loader message={"Under construction..."} />
}

export default StageConfirmDapp;