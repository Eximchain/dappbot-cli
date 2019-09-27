import React, { FC, useState, useEffect } from 'react';
import SelectInput, { Item as SelectItem } from 'ink-select-input';
import { TruffleArtifact } from '../../services/util';

export interface StageSelectArtifactProps {
  artifacts: TruffleArtifact[]
  setArtifact: (contract:TruffleArtifact) => void
}

export const StageSelectArtifact: FC<StageSelectArtifactProps> = (props) => {
  const { artifacts, setArtifact } = props;
  return (
    <SelectInput
      items={artifacts.map(artifact => ({
          label: artifact.contract_name,
          value: artifact.contract_name
        } as SelectItem))}
      onSelect={item => {
        let selection = artifacts.find(artifact => artifact.contract_name === item.value);
        if (selection) setArtifact(selection);
      }} />
  )
}

export default StageSelectArtifact;