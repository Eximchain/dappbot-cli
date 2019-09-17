import { Argv } from "yargs";

export const command = 'auth <command>';

export const desc = 'Auth API methods';

export function builder(yargs:Argv) {
  return yargs.commandDir('authCmds')
}

export function handler(argv:Argv) {

}