import { Argv, PositionalOptions } from "yargs";
import fs from 'fs';
import path from 'path';
import User from '@eximchain/dappbot-types/spec/user';
import { ArgShape } from "../cli";

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
 * Listens for the --authFile argument, and if present, attempts to
 * load that file as a JSON
 * @param args 
 */
export function loadAuthDataMiddleware(args:ArgShape): ArgShape {
  if (args.authFile) {
    const authPath = path.resolve(process.cwd(), args.authFile);
    if (!fs.existsSync(authPath)) throw new Error('The specified auth file path does not have a file!');
    args.authData = JSON.parse(fs.readFileSync(authPath).toString());
    if (!User.isAuthData(args.authData)) throw new Error("We found your file, but it doesn't contain valid auth data!");
  }
  console.log('args at end of middleware: ',args);
  return args;
}

/**
 * 
 * @param args 
 */
export function requireAuthData(args:ArgShape): ArgShape {
  if (!args.authData || !User.isAuthData(args.authData)) {
    throw new Error("You're calling a private API method; please supply a path to your authData file with the --authFile option.");
  }
  return args;
}