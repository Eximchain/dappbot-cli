import { Argv } from "yargs";

export const command = 'payment <command>';

export const desc = 'Payment API methods';

export function builder(yargs:Argv) {
  return yargs.commandDir('paymentCmds')
}

export function handler(argv:Argv) {

}