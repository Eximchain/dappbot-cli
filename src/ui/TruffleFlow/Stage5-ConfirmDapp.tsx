import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import SelectInput from 'ink-select-input';
import { Loader, ApiMethodLabel, PrettyRequest, TextBox, ItemList, ChainName } from '../helpers';
import { TruffleArtifact, ChainsById } from '../../services/util';
import { Tiers } from '@eximchain/dappbot-types/spec/dapp';
import { UpdateDapp, CreateDapp } from '@eximchain/dappbot-types/spec/methods/private';
import { Box } from 'ink';

export interface StageConfirmDapp {
  API: DappbotAPI
  isUpdate: boolean
  artifact: TruffleArtifact
  DappName: string
  Web3URL: string
  ContractAddr: string
}

export const StageConfirmDapp: FC<StageConfirmDapp> = (props) => {
  const { DappName, Web3URL, ContractAddr, API, isUpdate, artifact } = props;
  const [confirmed, setConfirmed] = useState(false);

  // Determine the name of the user's chosen network.
  // First find the chosen network artifact by checking to see
  // which one has the selected ContractAddr.  Then check
  // against our supported networks to see if we can display
  // a pretty name (e.g. "Ethereum (Ropsten)"), or if we just
  // have to use a standard "Custom Network - ChainID N"
  let networkName = '...';
  const networkArtifact = Object.keys(artifact.networks).map(chainId => {
    return { chainId, ...artifact.networks[chainId] }
  }).find(netArtifact => netArtifact.address === ContractAddr)

  if (!networkArtifact) throw new Error('Artifact should always be found.');
  let networkNum = parseInt(networkArtifact.chainId);
  const possibleNetworks = ChainsById[networkNum];
  if (possibleNetworks === undefined) {
    networkName = ChainName(networkNum)
  } else if (possibleNetworks.length === 1) {
    networkName = ChainName(networkNum, possibleNetworks[0]);
  } else {
    const chosenNetwork = possibleNetworks.find(chain => {
      return chain.web3Url === Web3URL;
    })
    if (!chosenNetwork) throw new Error('This code path implies that the network will be found.');
    networkName = ChainName(networkNum, chosenNetwork)
  }

  const AbiFxns = artifact.abi.map(method => method.name).sort((nameA, nameB) => {
    // This comparison ensures a descending sort, such that the
    // longest method names come first in the list.
    return nameB.length - nameA.length
  });

  if (!confirmed) {
    return (
      <Box>
        <TextBox>Before we create your dapp, let's make sure it's exactly what you want.</TextBox>
        <ItemList items={{
          'Dapp Name': DappName,
          'Contract': `${artifact.contract_name} (${AbiFxns.length} functions, including ${AbiFxns[0]} & ${AbiFxns[1]})`,
          'Network': networkName,
          'Deployed Address': ContractAddr,
        }} />
        <SelectInput 
          items={[
            { label: "Yes, make this dapp!", value: 'continue' },
            { label: "Let me start over", value: 'cancel' }
          ]} 
          onSelect={item => {
            if (item.value === 'continue') {
              setConfirmed(true);
            } else {
              process.exit(1);
            }
          }} />
      </Box>
    )
  }

  const Abi = JSON.stringify(artifact.abi);
  const req = isUpdate ?
    () => API.private.updateDapp.resource(DappName, { Web3URL, ContractAddr, Abi }) :
    () => API.private.createDapp.resource(DappName, {
      Web3URL, ContractAddr, Abi,
      GuardianURL: 'https://example.com',
      Tier: Tiers.Standard
    })
  const operation = isUpdate ?
    ApiMethodLabel(UpdateDapp.HTTP, UpdateDapp.Path(DappName)) :
    ApiMethodLabel(CreateDapp.HTTP, CreateDapp.Path(DappName))
  return (
    <PrettyRequest {...{ req, operation }} />
  )

}

export default StageConfirmDapp;