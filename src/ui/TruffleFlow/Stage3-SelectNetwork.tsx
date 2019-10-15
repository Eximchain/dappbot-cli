import React, { FC, useState } from 'react';
import { Text } from 'ink';
import flatten from 'lodash.flatten';
import { ArgPrompt, ChainOption, ChevronText, Select } from '../helpers';
import { TruffleArtifact } from '../../services';
import { XOR } from 'ts-xor';
import { StringElt } from '.';
import { Chain } from '@eximchain/dappbot-types/spec/dapp';

export interface StageSelectNetworkProps {
  artifact: TruffleArtifact
  setWeb3URL: (url: string) => void;
  setContractAddr: (addr: string) => void;
  progressMsgs: StringElt[]
  addProgressMsg: (msg:StringElt)=>void
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
      let matchingChains = Chain.detailsById()[networkId];
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
      key='select-network'
      label={progressMsgs.concat([
        <ChevronText key='select-network-label'>Which of {artifact.contract_name}'s networks would you like the dapp to communicate with?</ChevronText>
      ])}
      items={flatten(networkOptions)}
      onSelect={item => {
        if (typeof item.value === 'number') {
          // Custom network, require a web3 prompt
          const networkItem = artifact.networks[item.value.toString()];
          setNeedCustomWeb3(true);
          setContractAddr(networkItem.address);
        } else {
          const chosenNetwork = Chain.detailsByName()[item.value];
          if (!chosenNetwork) throw new Error("This should always be found.");
          const networkItem = artifact.networks[chosenNetwork.id.toString()]
          setNeedCustomWeb3(false);
          setContractAddr(networkItem.address);
          setWeb3URL(chosenNetwork.web3Url);
          addProgressMsg(
            <ChevronText key='chosen-network'>The Dapp will communicate with <Text underline>{chosenNetwork.displayName}</Text>.</ChevronText>
          )
        }
      }} />
  )

  if (needCustomWeb3) return (
    <ArgPrompt
      key='enter-url'
      name="Web3URL"
      isValid={val => {
        try {
          const newUrl = new URL(val);
          return newUrl.protocol !== 'https:' ?
            `Your Web3 URL must begin with https, not ${newUrl.protocol}` :
            null;
        } catch (TypeError) {
          return 'Please enter a valid URL; make sure you have https://'
        }
      }}
      label={progressMsgs.concat([
        <ChevronText key='custom-rpc'>We don't have an RPC URL on hand to communicate with this network.  Please provide a full Web3 HTTPProvider URL, including the https://.</ChevronText>
      ])}
      withResult={(newUrl) => {
        setWeb3URL(newUrl);
        addProgressMsg(
          <ChevronText key='custom-web3'>The Dapp will communicate with a custom network through <Text underline>{newUrl}</Text>.</ChevronText>
        )
      }} />
  )

  return null;
}

export default StageSelectNetwork;