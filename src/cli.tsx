#!/usr/bin/env node
import yargs, { Arguments } from 'yargs';
import { MethodAbi } from 'ethereum-types';
import User from '@eximchain/dappbot-types/spec/user';
import fs from 'fs';
import path from 'path';
import { loadFileMiddleware, checkDefaultAuthMiddleware } from './services/util';

const npmPackage = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../package.json')).toString());

export const DEFAULT_DATA_PATH = './dappbotAuthData.json';
export interface DappNameArg {
  DappName: string
}
export interface UniversalArgs {
	authPath?: string
	authFile?: string
	AbiPath?: string
	AbiFile?: string
}

export interface AdditionalArgs {
	[key:string] : any
}

export type ArgShape<Additional = AdditionalArgs> = Arguments<UniversalArgs & Additional>;

yargs
	.options({
		authPath : {
			alias: 'a',
			normalize: true,
			description: 'The path to a file with saved DappBot auth data.'
		}
	})
	.middleware(checkDefaultAuthMiddleware)
	.middleware(loadFileMiddleware)
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
	