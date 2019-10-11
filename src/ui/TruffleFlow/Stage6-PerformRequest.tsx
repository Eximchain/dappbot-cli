import React, { FC, useEffect } from 'react';
import { Static, Text } from 'ink';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { 
  Loader, errMsgFromResource, ErrorBox, Rows, 
  ChevronText, SuccessLabel
} from '../helpers';
import { TruffleArtifact, analytics } from '../../services/util';
import { Tiers } from '@eximchain/dappbot-types/spec/dapp';
import { useResource } from 'react-request-hook';
import Responses from '@eximchain/dappbot-types/spec/responses';

export interface StagePerformRequestProps {
  API: DappbotAPI
  isUpdate: boolean
  artifact: TruffleArtifact
  DappName: string
  Web3URL: string
  ContractAddr: string
}

export const StagePerformRequest: FC<StagePerformRequestProps> = (props) => {
  const { DappName, Web3URL, ContractAddr, API, isUpdate, artifact } = props;
  const Abi = JSON.stringify(artifact.abi);
  const req = isUpdate ?
    () => API.private.updateDapp.resource(DappName, { Web3URL, ContractAddr, Abi }) :
    () => API.private.createDapp.resource(DappName, {
      Web3URL, ContractAddr, Abi,
      GuardianURL: 'https://example.com',
      Tier: Tiers.Standard
    })

  const [res, makeReq] = useResource(req);
  const { isLoading, data, error } = res;
  useEffect(function callOnMount(){
    makeReq()
  }, [])

  useEffect(function trackResponse(){
    if (data && Responses.isSuccessResponse(data)) {
      // if (isUpdate) {
      //   analytics.track({

      //   })
      // } else {
      //   analytics.track({

      //   })
      // }
    }
  }, [data]);

  // Second clause here handles the very first render
  // before the effect is triggered.
  if (isLoading || (!isLoading && !data && !error)) return (
    <Loader message={`Your request to ${isUpdate ? 'update' : 'create'} ${DappName} is in the air...`} />
  )

  if (error) return (
    <ErrorBox permanent errMsg={errMsgFromResource(error)} />
  )

  return (
    <Static>
      <Rows>
        <Text><SuccessLabel />{' '}Your dapp is all ready to go!  You can start using it right now.</Text>
        <ChevronText>Run <Text underline>dappbot goto {DappName}</Text> to open it in your default browser.</ChevronText>
        <ChevronText>Run <Text underline>dappbot api private/readDapp {DappName}</Text> to read its config.</ChevronText>
      </Rows>
      <></>
    </Static>
  )

}

export default StagePerformRequest;