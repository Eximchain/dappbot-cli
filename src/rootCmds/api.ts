import { Argv } from "yargs";
import yargs = require("yargs");
import { ArgShape } from "../cli";

export const command = 'api <resource/method> [args]';

export const desc = 'Directly access all of DappBot API methods, organized by their endpoints.';

export function builder(yargs:Argv) {
  return yargs
    .commandDir('authCmds')
    .commandDir('privateCmds')
    .commandDir('publicCmds')
}

export function handler(argv:ArgShape) {
  if (argv._[0]) {
    console.log(`\nUnknown commmand ${argv._[0]}, please see the command list below:`);
    console.log('')
    yargs.showHelp()    
  }
}