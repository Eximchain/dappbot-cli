import { Argv, PositionalOptions, MiddlewareFunction } from "yargs";
import { render } from 'ink';
import fs from 'fs';
import path from 'path';
import User from '@eximchain/dappbot-types/spec/user';
import { MethodAbi } from 'ethereum-types';
import { ArgShape, DEFAULT_DATA_PATH, AdditionalArgs, UniversalArgs } from "../cli";
import groupBy from 'lodash.groupby';


export const fastRender:typeof render = (tree) => {
  // @ts-ignore Types don't know about fastmode
  return render(tree, { experimental: true })
}
/**
 * Given a desired command name and an example of the argument shape
 * the command needs to output, return a yargs `command` string
 * which includes all of the sample's keys as required arguments.
 * @param command 
 * @param sampleArg 
 */
export function commandFromSampleArgs(command:string, sampleArg:any) {
  // Sorts arg names alphabetically, except for username, which
  // always ought to be at the front of the list.
  let args = Object.keys(sampleArg).sort();
  if (args.includes('username')) {
    args = ['username', ...args.filter(arg => arg !== 'username')]
  }
  // If this delimiter used [ ] instead of < >, the args would be
  // marked as optional.
  let delimiter = (name:string) => `<${name}>`;
  return `${command} ${args.map(delimiter).join(' ')}`
}

type DescriptionMap<Shape> = Partial<Record<keyof Shape, string>>;

/**
 * Given a yargs instance, a sample argument shape, and a map of
 * descriptions, call the `yargs.positional()` function with the
 * appropriate args to instrument the command with help text for
 * all arguments.  **Note**: This does not supported nested
 * arguments; if a key's value type is not `string`, `number`, 
 * or `boolean`, it is ignored.
 * @param yargs 
 * @param argShape 
 * @param descriptions 
 */
export function describePositionalArgs<Shape extends object>(yargs:Argv, argShape:Shape, descriptions?:DescriptionMap<Shape>){
  Object.keys(argShape).forEach((reqdKey) => {
    let keyName = reqdKey as keyof Shape;
    let keyType = typeof argShape[keyName];
    if (
      keyType === 'string' ||
      keyType === 'number' ||
      keyType === 'boolean'
    ) {
      let keyDesc = { type : keyType } as PositionalOptions;
      if (descriptions && descriptions[keyName]) {
        keyDesc.describe = descriptions[keyName]
      }
      yargs.positional(reqdKey, keyDesc)
    }
  })
}

/**
 * Middlware: Listen for any options whose name ends in "Path", and if found,
 * read the file's contents as a string and add it as an argument
 * whose name ends in "File".  For instance, "authPath" will yield
 * an "authFile" string, which can be JSON.parse()d to get the
 * actual authData.
 * @param args 
 */
export function loadFileFromPath(args:ArgShape): ArgShape {
  const pathKeys = Object.keys(args).filter(key => key.indexOf('Path') > -1);
  pathKeys.forEach(pathKey => {
    const fullPath = path.resolve(process.cwd(), args[pathKey]);
    if (!fs.existsSync(fullPath)) throw new Error(`The specified path (${pathKey}, ${args[pathKey]}) does not have a file!`);
    const fileKey = `${pathKey.slice(0, pathKey.indexOf('Path'))}File`;
    args[fileKey] = fs.readFileSync(fullPath).toString();
  })
  return args;
}

/**
 * 
 * @param args 
 */
export function addDefaultAuthIfPresent(args:ArgShape): ArgShape {
  if (!args.authPath) {
    const defaultPath = path.resolve(process.cwd(), DEFAULT_DATA_PATH);
    if (fs.existsSync(defaultPath)) {
      args.authPath = defaultPath;
    }
  }
  return args;
}


export const requireAuthData:MiddlewareFunction<UniversalArgs> = (args) => {
  if (!args.authFile || !User.isAuthData(JSON.parse(args.authFile))) {
    console.log("You're calling a private API method; please supply a path to your authData file with the --authPath option.");
    process.exit(1);
  }
  return args;
}

/**
 * POTENTIAL OPTIONS:
 * - Contract artifacts directory
 * 
 */

export function cleanExit(message:string) {
  console.log(`\n${message}\n`)
  process.exit(1);
}

/**
 * Accepts one or more file names (string or string array)
 * and a directory, checks whether those files exist in said
 * directory.  File names do not need relative path prefixes.
 * If multiple names are provided, function returns true if
 * **any** of the files are present.
 * 
 * @param fileName 
 * @param dir 
 */
export function pathExists(fileName:string|string[], dir:string):boolean {
  const exists = (name:string) => fs.existsSync(path.resolve(dir, name))
  if (Array.isArray(fileName)) {
    return fileName.some(file => exists(file))
  } else {
    return exists(fileName);
  }
}

export enum SupportedChains {
  Eximchain = 'eximchain',
  EximGamma = 'eximchainGamma',
  Ethereum = 'ethereum',
  Ropsten = 'ropsten',
  Kovan = 'kovan',
  Rinkeby = 'rinkeby',
  Goerli = 'goerli'
}

export interface ChainIdentity {
  chainId: number
  genesisHash: string
  web3Url: string
  key: SupportedChains
  displayName: string
}

// Dropping this key until I know I have a valid gamma tx executor
// to point Dapps at.
//
// {
//   chainId : 1,
//   genesisHash : '0x6a2d1d7602dbebc139cf9598607bf012d30da83954aab5f731d7550feb283bdc',
//   key : SupportedChains.EximGamma,
//   displayName : 'Eximchain (Gamma)'
// },

export const ChainIdentities:ChainIdentity[] = [
  {
    chainId : 1,
    genesisHash : '0x722138a9f3635c65747a8e2eeac7e7963846fb952b8931da257395fd7656c3dd',
    web3Url: "https://tx-executor-stress-test.eximchain.com",
    key : SupportedChains.Eximchain,
    displayName : 'Eximchain (Main Net)'
  },
  {
    chainId : 1,
    genesisHash : '0xd4e56740f876aef8c010b86a40d5f56745a118d0906a34e69aec8c0db1cb8fa3',
    web3Url: "https://mainnet.infura.io/v3/45c2433b314e4ad09674978a2b9cce43",
    key : SupportedChains.Ethereum,
    displayName : 'Ethereum (Main Net)'
  },
  {
    chainId : 3,
    genesisHash : '0x41941023680923e0fe4d74a34bdac8141f2540e3ae90623718e47d66d1ca4a2d',
    web3Url: "https://ropsten.infura.io/v3/f084d60882a94d76bfb3b587af30e8e6",
    key : SupportedChains.Ropsten,
    displayName : 'Ethereum (Ropsten)'
  },
  {
    chainId : 42,
    genesisHash : '0xa3c565fc15c7478862d50ccd6561e3c06b24cc509bf388941c25ea985ce32cb9',
    web3Url: "https://kovan.infura.io/v3/c58eda7787d342c7b41f8a3f38893def",
    key : SupportedChains.Kovan,
    displayName : 'Ethereum (Kovan)'
  },
  {
    chainId : 4,
    genesisHash : '0x6341fd3daf94b748c72ced5a5b26028f2474f5f00d824504e4fa37a75767e177',
    key : SupportedChains.Rinkeby,
    web3Url: "https://rinkeby.infura.io/v3/70a3fea548984fffbe86de56093b8044",
    displayName : 'Ethereum (Rinkeby)'
  },
  {
    chainId : 5,
    genesisHash : '0xbf7e331f7f7c1dd2e05159666b3bf8bc7a8a3a9eb1d518969eab529dd9b88c1a',
    key : SupportedChains.Goerli,
    web3Url: 'https://goerli.infura.io/v3/55454709df7f4e54a660ceb5ad5a844c',
    displayName : 'Ethereum (Goerli)'
  }
]

export const ChainsById = groupBy(ChainIdentities, identity => identity.chainId);

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
    updatedAt: number
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
  return (
    isObject(val) &&
    Object.keys(val).every(val => parseInt(val) !== NaN) &&
    Object.values(val).every((networkVal:any) => {
      return (
        isObject(networkVal) &&
        typeof networkVal.address === 'string' &&
        typeof networkVal.updatedAt === 'number'
      )
    })
  )
}