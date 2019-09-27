import React, { FC, useState, useEffect } from 'react';
import SelectInput from 'ink-select-input';
import flatten from 'lodash.flatten';
import groupBy from 'lodash.groupby';
import { Loader, SuccessBox, ArgPrompt } from '../helpers';
import { TruffleArtifact, ChainIdentities, SupportedChains, ChainIdentity } from '../../services/util';
import { XOR } from 'ts-xor';

export interface StageSelectNetworkProps {
  artifact: TruffleArtifact
  setWeb3URL: (url: string) => void;
  setContractAddr: (addr: string) => void;
}

const option = (chainId:number, chain?:ChainIdentity) => {
  return chain ? ({
    label: `${chain.displayName} - Chain ID ${chain.chainId}`, value: chain.key
  }) : ({
    label: `Custom Chain - Chain ID ${chainId}`, value: chainId
  })
}

export const StageSelectNetwork: FC<StageSelectNetworkProps> = ({ artifact, setWeb3URL, setContractAddr }) => {

  // Compile chainIds present in artifact
  const [needCustomWeb3, setNeedCustomWeb3] = useState(null as XOR<null, boolean>);
  const networkIds = Object.keys(artifact.networks);
  const supportedChainsById = groupBy(ChainIdentities, identity => identity.chainId);

  const networkOptions = networkIds.map(parseInt).map(networkId => {
    let matchingChains = supportedChainsById[networkId];
    if (matchingChains === undefined) {
      // Custom network option
      return option(networkId);
    } else if (matchingChains.length === 1) {
      // Perfect match, simply list option
      return option(networkId, matchingChains[0]);
    } else {
      // Multi-match, must be network 1, return an array of options
      return matchingChains.map((eachChain) => option(networkId, eachChain))
    }
  })

  if (needCustomWeb3 === null) return (
    <SelectInput
      items={flatten(networkOptions)}
      onSelect={item => {
        if (typeof item.value === 'number') {
          // Custom network, require a web3 prompt
          const networkItem = artifact.networks[item.value.toString()];
          setNeedCustomWeb3(true);
          setContractAddr(networkItem.address);
        } else {
          const chosenNetwork = ChainIdentities.find(chain => chain.key === item.value)
          if (!chosenNetwork) throw new Error("This should always be found.");
          const networkItem = artifact.networks[chosenNetwork.chainId.toString()]
          setNeedCustomWeb3(false);
          setContractAddr(networkItem.address);
          setWeb3URL(chosenNetwork.web3Url);
        }
      }} />
  )

  return needCustomWeb3 ? (
    <ArgPrompt 
      name="We don't have an RPC URL on hand to communicate with this network.  Please provide a full Web3 HTTPProvider URL, including the https:// "
      withResult={setWeb3URL}/>
  ) : (
    <SuccessBox result={{message: "Your dapp's network has been successfully configured!"}} />
  )
}

export default StageSelectNetwork;