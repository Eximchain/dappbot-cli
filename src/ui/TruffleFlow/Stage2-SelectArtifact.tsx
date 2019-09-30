import React, { FC, useEffect } from 'react';
import { TruffleArtifact } from '../../services/util';
import { LabeledContent, Select } from '../helpers';

export interface StageSelectArtifactProps {
  artifacts: TruffleArtifact[]
  setArtifact: (contract: TruffleArtifact) => void
  progressMsgs: string[]
  addProgressMsg: (msg:string)=>void
}

export const StageSelectArtifact: FC<StageSelectArtifactProps> = (props) => {
  const { artifacts, setArtifact, progressMsgs, addProgressMsg } = props;

  useEffect(function autoSelectLoneArtifact(){
    if (artifacts.length === 1) {
      setArtifact(artifacts[0])
      addProgressMsg(`Automatically using the ${artifacts[0].contract_name} contract; it it the only one which has been deployed.`)
    }
  }, [artifacts])

  return (
    <Select
      label={progressMsgs.concat(["Which contract would you like to make a dapp for?"])}
      items={artifacts.map(artifact => ({
        label: artifact.contract_name,
        value: artifact.contract_name
      }))}
      onSelect={item => {
        let selection = artifacts.find(artifact => artifact.contract_name === item.value);
        if (selection) {
          setArtifact(selection)
          addProgressMsg(`Using the ${selection.contract_name} contract.`)
        };
      }} />
  )
}

export default StageSelectArtifact;