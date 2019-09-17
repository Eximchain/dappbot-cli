import { Argv } from "yargs";

export const command = 'private <command>';

export const desc = 'Private API methods';

export function builder(yargs:Argv) {
  return yargs.commandDir('privateCmds')
}

export function handler(argv:Argv) {

}