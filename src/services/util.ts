import { Argv, PositionalOptions } from "yargs";
import { render } from 'ink';
import fs from 'fs';
import path from 'path';
import User from '@eximchain/dappbot-types/spec/user';
import { ArgShape, DEFAULT_DATA_PATH } from "../cli";

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

/**
 * 
 * @param args 
 */
export function requireAuthData(args:ArgShape): ArgShape {
  if (!args.authFile || !User.isAuthData(JSON.parse(args.authFile))) {
    console.log("You're calling a private API method; please supply a path to your authData file with the --authPath option.");
    process.exit(1);
  }
  return args;
}

// export function refreshAuthFile(args:ArgShape): ArgShape {
//   if (!args.authFile) return args;
//   const authData = JSON.parse(args.authFile);
//   const needRefresh = new API({ authData, })
// }