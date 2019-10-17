import Analytics from 'analytics-node';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { npmPackage } from "../cli";
import { CreateDapp, UpdateDapp } from '@eximchain/dappbot-types/spec/methods/private';

const WRITE_KEY = 'aMv7BUcQfCSy8XYMBgXYMdLMr8fkhI4a';
const analytics = new Analytics(WRITE_KEY, { flushAt: 1})
function standardTrackProps(API:DappbotAPI, extraProps?:SharedTrackProps) {
  return {
    email: API.authData.User.Email,
    apiUrl: API.dappbotUrl,
    cliVersion: npmPackage.version as string,
    client: 'dappbot-cli',
    ...extraProps
  }
}

interface SharedTrackProps {
  isTruffle?: boolean
}

export function trackSignup(API:DappbotAPI, email:string, metadata:Record<string, any>, extraProps?:SharedTrackProps) {
  analytics.identify({
    userId: email,
    traits: metadata
  })
  analytics.track({
    event: 'User Signup',
    userId: email,
    properties: {
      ...standardTrackProps(API, extraProps),
      // Manually setting email because we do not
      // expect the API to have any valid auth
      // within this flow.
      email, name
    }
  })
}

export function trackLogin(API:DappbotAPI, isRefresh:boolean, extraProps?:SharedTrackProps) {
  analytics.track({
    userId: API.authData.User.Email,
    event: 'User Login',
    properties: {
      ...standardTrackProps(API, extraProps),
      isRefresh
    }
  })
}

type TrackedCreateProps = Omit<CreateDapp.Args, 'Abi'|'GuardianURL'>
export function trackCreateDapp(API:DappbotAPI, DappName:string, createArgs:TrackedCreateProps, extraProps?:SharedTrackProps) {
  analytics.track({
    event: 'Dapp Created',
    userId: API.authData.User.Email,
    properties: {
      ...standardTrackProps(API, extraProps),
      DappName, ...createArgs
    }
  })
}

export function trackDeleteDapp(API:DappbotAPI, DappName:string, extraProps?:SharedTrackProps) {
  analytics.track({
    event: 'Dapp Deleted',
    userId: API.authData.User.Email,
    properties: {
      ...standardTrackProps(API, extraProps),
      DappName
    }
  })
}

type TrackedUpdateProps = Omit<UpdateDapp.Args, 'Abi'>
export function trackUpdateDapp(API:DappbotAPI, DappName:string, updateArg:TrackedUpdateProps, extraProps?:SharedTrackProps) {
  analytics.track({
    event: 'Dapp Updated',
    userId: API.authData.User.Email,
    properties: {
      ...standardTrackProps(API, extraProps),
      DappName, ...updateArg
    }
  })
}