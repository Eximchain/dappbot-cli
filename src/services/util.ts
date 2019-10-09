import { Argv, PositionalOptions, MiddlewareFunction } from "yargs";
import { render } from 'ink';
import fs from 'fs';
import path from 'path';
import User from '@eximchain/dappbot-types/spec/user';
import { MethodAbi } from 'ethereum-types';
import { ArgShape, DEFAULT_DATA_PATH, DEFAULT_CONFIG_PATH, UniversalArgs } from "../cli";
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

export function addDefaultConfigIfPresent(args:ArgShape): ArgShape {
  if (args.config) return args;
  const defaultPath = path.resolve(process.cwd(), DEFAULT_CONFIG_PATH);
  if (!fs.existsSync(defaultPath)) return args;
  Object.assign(args, JSON.parse(fs.readFileSync(defaultPath).toString()))
  return args;
}


export function addDefaultAuthIfPresent(args:ArgShape): ArgShape {
  if (args.authPath) return args;
  const defaultPath = path.resolve(process.cwd(), DEFAULT_DATA_PATH);
  if (!fs.existsSync(defaultPath)) return args;
  args.authPath = defaultPath;
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