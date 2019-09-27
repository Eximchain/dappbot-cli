import React, { FC, useState, useEffect } from 'react';
import DappbotAPI from '@eximchain/dappbot-api-client';
import SelectInput, { Item as SelectItem } from 'ink-select-input';
import { Loader, SuccessBox, ArgPrompt } from '../helpers';
import { TruffleArtifact } from '../../services/util';
import { useResource } from 'react-request-hook';

export interface StageSetDappNameProps {
  API: DappbotAPI
  setDappName: (DappName:string) => void
  artifact: TruffleArtifact
}

export const StageSetDappName: FC<StageSetDappNameProps> = ({ API, artifact, setDappName }) => {
  // Determine whether their contract name is available
  const contractName = artifact.contract_name;
  const [desiredName, setDesiredName] = useState(contractName);
  const [isAvailable, checkIfAvailable] = useResource(API.public.viewDapp.resource);
  const { isLoading, data, error } = isAvailable;

  if (isLoading) {
    // Checking if your name is available
    return <Loader message={`Checking to see if ${desiredName} is available...`} />
  } else if (error) {
    // Not loading and we have an error, the current name must be
    // acceptable.  Prompt the user to confirm their name selection
    return (
      <SelectInput 
        items={[
          { label: `Use ${desiredName} for your Dapp's name`, value: 'continue' },
          { label: 'Check a different name', value: 'restart' }
        ]}
        onSelect={item => {
          if (item.value === 'continue') {
            setDappName(desiredName);
          } else {
            setDesiredName('')
          }
        }} />
    )
  } else {
    // Check for the presence of data to see if we need to include
    // an error message about their prior choice not being valid
    // anymore
    return (
      <ArgPrompt 
        name='' 
        defaultValue={desiredName} 
        withResult={newName => {
          setDesiredName(newName);
          checkIfAvailable(newName);
        }} />
    )
  }

}

export default StageSetDappName;