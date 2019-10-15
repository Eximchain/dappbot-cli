import React, { FC, useState, useEffect } from 'react';
import { Text } from 'ink';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { Loader, ArgPrompt, Select, Rows, ChevronText } from '../helpers';
import { TruffleArtifact } from '../../services';
import { useResource } from 'react-request-hook';
import { StringElt } from '.';

export interface StageSetDappNameProps {
  API: DappbotAPI
  setDappName: (DappName: string) => void
  artifact: TruffleArtifact
  progressMsgs: StringElt[]
  addProgressMsg: (msg:StringElt)=>void
}

export const StageSetDappName: FC<StageSetDappNameProps> = ({ API, artifact, setDappName, progressMsgs, addProgressMsg }) => {
  // Determine whether their contract name is available
  const contractName = artifact.contract_name;
  const [desiredName, setDesiredName] = useState(contractName);
  const [isAvailable, setIsAvailable] = useState(false);
  const [checkResponse, checkIfAvailable] = useResource(API.public.viewDapp.resource);

  useEffect(function checkDesiredName() {
    if (desiredName !== '') checkIfAvailable(desiredName);
  }, [desiredName, checkIfAvailable])

  useEffect(function handleCheckResponse(){
    const { data, error } = checkResponse;
    if (data && data.data) setIsAvailable(false);
    if (error) setIsAvailable(true);
  }, [checkResponse])

  if (checkResponse.isLoading) {
    // Checking if your name is available
    return (
      <Rows>
        {...progressMsgs}
        <Loader key='name-check-loader' message={`Checking to see if ${desiredName} is available...`} />
      </Rows>

    )
  } else if (!isAvailable) {
    let data = checkResponse.data;
    // Check for the presence of data to see if we need to include
    // an error message about their prior choice not being valid
    // anymore
    return (
      <ArgPrompt
        name='DappName'
        key='get-dapp-name'
        label={progressMsgs.concat([
          <ChevronText key='need-new-name'>
            {
              data && desiredName !== '' ?
                `Unfortunately, ${desiredName} is taken.  What else would you like to call your dapp?` :
                `What would you like to call your dapp?`
            }
          </ChevronText>
        ])}
        defaultValue={desiredName === contractName && !data ? desiredName : undefined}
        withResult={setDesiredName} />
    )
  } else {
    // Not loading and we have an error, the current name must be
    // acceptable.  Prompt the user to confirm their name selection
    return (
      <Select
        key='continue-with-name'
        label={progressMsgs.concat([
          <ChevronText key='name-available'>The dapp name "{desiredName}" is available!</ChevronText>
        ])}
        items={[
          { label: `Use ${desiredName}`, value: 'continue' },
          { label: 'Check a different name', value: 'restart' }
        ]}
        onSelect={item => {
          if (item.value === 'continue') {
            setDappName(desiredName);
            addProgressMsg(
              <ChevronText key='name-selected'>Your dapp's name will be <Text underline>{desiredName}</Text>.</ChevronText>
            )
          } else {
            setDesiredName('')
            setIsAvailable(false);
          }
        }} />
    )
  }

}

export default StageSetDappName;