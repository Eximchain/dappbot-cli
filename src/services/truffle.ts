import { MethodAbi } from "ethereum-types";

/**
 * These interfaces do not represent a full Truffle artifact,
 * just the pieces which we'll be using.
 */
export interface TruffleArtifact {
  contract_name: string
  abi: MethodAbi[]
  networks: NetworkMap
}

export interface NetworkMap {
  [key:string] : {
    address: string
  }
}


function isObject(val:any) {
  return val !== null && typeof val === 'object';
}

export function isTruffleArtifact(val:any): val is TruffleArtifact {
  return (
    isObject(val) &&
    typeof val.contract_name === 'string' &&
    Array.isArray(val.abi) &&
    isNetworkMap(val.networks)
  )
}

export function isNetworkMap(val:any): val is NetworkMap {
  if (!isObject(val)) return false;
  if (Object.keys(val).length === 0) return true;
  return (
    Object.keys(val).every(val => parseInt(val) !== NaN) &&
    Object.values(val).every((networkVal:any) => {
      return (
        isObject(networkVal) &&
        typeof networkVal.address === 'string'
      )
    })
  )
}