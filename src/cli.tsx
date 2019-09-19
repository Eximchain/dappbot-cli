#!/usr/bin/env node
import yargs, { Arguments } from 'yargs';
import User from '@eximchain/dappbot-types/spec/user';
import fs from 'fs';
import path from 'path';
import { loadAuthDataMiddleware } from './services/util';

const npmPackage = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../package.json')).toString());

export interface DappNameArg {
  DappName: string
}
export interface UniversalArgs {
	authFile?: string
	authData?: User.AuthData
}

export interface AdditionalArgs {
	[key:string] : any
}

export type ArgShape<Additional = AdditionalArgs> = Arguments<UniversalArgs & Additional>;

yargs
	.options({
		authFile : {
			alias: 'a',
			type: 'string',
			description: 'The path to a file with saved DappBot auth data.'
		}
	})
	.middleware(loadAuthDataMiddleware)
	.commandDir('rootCmds')
	.usage('Usage: dappbot <command> [args]')
	.demandCommand(2)
	.wrap(Math.min(yargs.terminalWidth(), 160))
	.help('help')
	.alias('help', 'h')
	.version(npmPackage.version)
	.alias('version', 'v')
	.epilog('© Eximchain Pte. Ltd.')
	.argv
	