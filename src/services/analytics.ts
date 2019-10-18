import Analytics from 'analytics-node';
import DappbotAPI from '@eximchain/dappbot-api-client';
import { npmPackage } from "../cli";
import { CreateDapp, UpdateDapp } from '@eximchain/dappbot-types/spec/methods/private';
import { cleanExit } from './util';

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
  isTruffle?: boolean,
  exitOnFlush?: boolean
}

interface TrackOptions {
  exitOnFlush?: boolean
}

// safeTrack
// 1. Verify that the final userId is non-empty, bail &otherwise
// 2. Perform the actual call inside of a try-catch
// 3. Log on failure to send, but that's it.
// 4. If we have exit on flush, do that.
const safeTrack:Analytics['track'] = (message, cb, opts?: TrackOptions) => {

  // Silently bail out if there's no userId, like on signup.
  if (!message.userId || message.userId === '') return analytics;

  try {
    return analytics.track(message,(err, data) => {
      if (opts && opts.exitOnFlush) cleanExit('')
      if (cb) cb(err, data);
    });
  } catch (err) {
    console.log(`Failed to send the below analytics to Segment:`)
    console.log(message);
    console.log(`Error Message: ${err.message}`)
    return analytics;
  }
}

export function trackSignup(API:DappbotAPI, email:string, metadata:Record<string, any>, extraProps?:SharedTrackProps) {
  try {
    analytics.identify({
      userId: email,
      traits: metadata
    })
  } catch (err) {
    console.log('Err on analytics.identify(): ',err);
  }
  safeTrack({
    event: 'User Signup',
    userId: email,
    properties: {
      ...standardTrackProps(API, extraProps),
      ...metadata,
      // Manually setting email at the end because 
      // we do not expect the API to have any valid 
      // auth within this flow, so the email from
      // standardTrackProps would be incorrect.
      email
    }
  })
}

export function trackLogin(API:DappbotAPI, isRefresh:boolean, extraProps?:SharedTrackProps) {
  safeTrack({
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
  safeTrack({
    event: 'Dapp Created',
    userId: API.authData.User.Email,
    properties: {
      ...standardTrackProps(API, extraProps),
      DappName, ...createArgs
    }
  })
}

export function trackDeleteDapp(API:DappbotAPI, DappName:string, extraProps?:SharedTrackProps) {
  safeTrack({
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
  safeTrack({
    event: 'Dapp Updated',
    userId: API.authData.User.Email,
    properties: {
      ...standardTrackProps(API, extraProps),
      DappName, ...updateArg
    }
  })
}