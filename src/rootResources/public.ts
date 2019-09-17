import { Argv } from "yargs";

export const command = 'public <command>';

export const desc = 'Public API methods';

export function builder(yargs:Argv) {
  return yargs.commandDir('publicCmds')
}

export function handler(argv:Argv) {

}