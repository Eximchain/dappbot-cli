#!/usr/bin/env node
import yargs, { Arguments } from 'yargs';
import fs from 'fs';
import path from 'path';
import { loadFileFromPath, addDefaultAuthIfPresent } from './services/util';

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
	apiUrl: string
	hubUrl: string
	mngrUrl: string
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
		},
		apiUrl: {
			description: "The URL for DappBot's API.",
			default: 'https://cli-api.eximchain-dev.com'
		},
		mngrUrl: {
			description: "The URL for DappBot's management app",
			default: 'https://cli-mngr.eximchain-dev.com'
		},
		hubUrl: {
			description: 'The URL for DappHub.',
			default: 'https://cli-hub.eximchain-dev.com'
		}
	})
	.middleware(addDefaultAuthIfPresent)
	.middleware(loadFileFromPath)
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
	