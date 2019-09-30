import React, { FC, useState } from 'react';
import flatten from 'lodash.flatten';
import { ArgPrompt, ChainOption, LabeledContent, Select } from '../helpers';
import { TruffleArtifact, ChainIdentities, ChainsById } from '../../services/util';
import { XOR } from 'ts-xor';

export interface StageSelectNetworkProps {
  artifact: TruffleArtifact
  setWeb3URL: (url: string) => void;
  setContractAddr: (addr: string) => void;
  progressMsgs: string[]
  addProgressMsg: (msg:string)=>void
}

export const StageSelectNetwork: FC<StageSelectNetworkProps> = (props) => {
  const { artifact, setWeb3URL, setContractAddr, progressMsgs, addProgressMsg } = props; 

  // Compile chainIds present in artifact
  const [needCustomWeb3, setNeedCustomWeb3] = useState(null as XOR<null, boolean>);
  const networkIds = Object.keys(artifact.networks);
  const networkOptions = networkIds
    .map(netId => parseInt(netId))
    .filter(netId => netId !== NaN)
    .map(networkId => {
      let matchingChains = ChainsById[networkId];
      if (matchingChains === undefined) {
        // Custom network option
        return ChainOption(networkId);
      } else if (matchingChains.length === 1) {
        // Perfect match, simply list option
        return ChainOption(networkId, matchingChains[0]);
      } else {
        // Multi-match, must be network 1, return an array of options
        return matchingChains.map((eachChain) => ChainOption(networkId, eachChain))
      }
    })

  // TODO: If there's only one network option, have an effect
  // automatically select it

  if (needCustomWeb3 === null) return (
    <Select
      label={progressMsgs.concat(["Which of your contract's networks would you like the dapp to communicate with?"])}
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

  if (needCustomWeb3) return (
    <ArgPrompt
      name="Web3URL"
      label={progressMsgs.concat(["We don't have an RPC URL on hand to communicate with this network.  Please provide a full Web3 HTTPProvider URL, including the https://."])}
      withResult={setWeb3URL} />
  )

  return null;
}

export default StageSelectNetwork;