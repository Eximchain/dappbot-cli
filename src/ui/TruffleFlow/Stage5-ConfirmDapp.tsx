import React, { FC } from 'react';
import { Select, ChevronText, ItemList, ChainName } from '../helpers';
import { TruffleArtifact, ChainsById } from '../../services/util';
import { Box } from 'ink';

export interface StageConfirmDapp {
  isUpdate: boolean
  artifact: TruffleArtifact
  DappName: string
  Web3URL: string
  ContractAddr: string
  startOver: () => void
  confirmDapp: () => void
}

export const StageConfirmDapp: FC<StageConfirmDapp> = (props) => {
  const { DappName, Web3URL, ContractAddr, isUpdate, artifact, startOver, confirmDapp } = props;

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

  const dappDetails = {
    'Dapp Name': DappName,
    'Contract': `${artifact.contract_name} (${AbiFxns.length} functions, including ${AbiFxns[0]} & ${AbiFxns[1]})`,
    'Network': networkName,
    'Deployed Address': ContractAddr,
  } as { [key:string] : string };

  if (possibleNetworks === undefined) {
    dappDetails['Web3 URL'] = Web3URL;
  }
  
  return (
    <Box flexDirection='column' margin={1}>
      <ChevronText>Before we { isUpdate ? 'update' : 'create'} your dapp, let's make sure it's exactly what you want.</ChevronText>
      <Box flexDirection='row' marginX={1}>
        <ItemList items={dappDetails} />
      </Box>
      <Box flexDirection='row'>
        <Select
          items={[
            { label: "Yes, make this dapp!", value: 'continue' },
            { label: "Let me start over", value: 'cancel' }
          ]}
          onSelect={item => {
            if (item.value === 'continue') {
              confirmDapp();
            } else {
              startOver();
            }
          }} />
      </Box>
    </Box>
  )

}

export default StageConfirmDapp;