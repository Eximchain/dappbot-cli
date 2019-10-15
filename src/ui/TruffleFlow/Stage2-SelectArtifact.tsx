import React, { FC, useEffect } from 'react';
import { Text } from 'ink';
import { TruffleArtifact } from '../../services';
import { Select, ChevronText } from '../helpers';
import { StringElt } from '.';

export interface StageSelectArtifactProps {
  artifacts: TruffleArtifact[]
  setArtifact: (contract: TruffleArtifact) => void
  progressMsgs: StringElt[]
  addProgressMsg: (msg:StringElt)=>void
}

export const StageSelectArtifact: FC<StageSelectArtifactProps> = (props) => {
  const { artifacts, setArtifact, progressMsgs, addProgressMsg } = props;

  useEffect(function autoSelectLoneArtifact(){
    if (artifacts.length === 1) {
      setArtifact(artifacts[0])
      addProgressMsg(
        <ChevronText key='auto-select-artifact'>
          Automatically using the <Text underline>{artifacts[0].contract_name}</Text> contract; it is the only one which has been deployed.
        </ChevronText>
      )
    }
  }, [artifacts])

  return (
    <Select
      key='select-artifact'
      label={progressMsgs.concat([
        <ChevronText key='artifact-select-label'>Which contract would you like to make a dapp for?</ChevronText>
      ])}
      items={artifacts.map(artifact => ({
        label: artifact.contract_name,
        value: artifact.contract_name
      }))}
      onSelect={item => {
        let selection = artifacts.find(artifact => artifact.contract_name === item.value);
        if (selection) {
          setArtifact(selection)
          addProgressMsg(
            <ChevronText key='selected-artifact'>
              Using the <Text underline>{selection.contract_name}</Text> contract.
            </ChevronText>
          )
        };
      }} />
  )
}

export default StageSelectArtifact;