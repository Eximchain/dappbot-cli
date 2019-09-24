import React, { FC, useState, useEffect } from 'react';
import path from 'path';
import fs from 'fs';
import Spinner from 'ink-spinner';
import { useResource } from 'react-request-hook';
import DappbotAPI from '@eximchain/dappbot-api-client';
import ArgPrompt from './helpers/ArgPrompt';
import Responses from '@eximchain/dappbot-types/spec/responses';
import { BoxPads, TextBox, Loader } from './helpers';
import { Box, Text, Static } from 'ink';

export interface TruffleFlowProps {
  API: DappbotAPI
}

export const TruffleFlow:FC<TruffleFlowProps> = ({ API }) => {

  return (
    <BoxPads>

    </BoxPads>
  )
}

export default TruffleFlow;