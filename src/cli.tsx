#!/usr/bin/env node
import yargs, { Arguments } from 'yargs';
import fs from 'fs';
import path from 'path';
import { loadFileFromPath, addDefaultAuthIfPresent, addDefaultConfigIfPresent } from './services/util';

const npmPackage = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../package.json')).toString());

export const DEFAULT_CONFIG_PATH = './dappbotConfig.json';
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
			description: 'The path to a JSON file with saved DappBot auth data.'
		},
		apiUrl: {
			description: "The URL for DappBot's API.",
			default: 'https://api.dapp.bot',
			group: 'URL Options:'
		},
		mngrUrl: {
			description: "The URL for DappBot's management app",
			default: 'https://dapp.bot',
			group: 'URL Options:'
		},
		hubUrl: {
			description: 'The URL for DappHub.',
			default: 'https://hub.dapp.bot',
			group: 'URL Options:'
		}
	})
	.middleware(addDefaultAuthIfPresent)
	.middleware(addDefaultConfigIfPresent)
	.middleware(loadFileFromPath)
	.commandDir('rootCmds')
	.usage('Usage: dappbot <command>')
	.demandCommand(2)
	.wrap(Math.min(yargs.terminalWidth(), 160))
	.help('help')
	.alias('help', 'h')
	.version(npmPackage.version)
	.alias('version', 'v')
	.hide('help')
	.hide('version')
	.epilog('Made by Eximchain Pte. Ltd.')
	.config('config', "Path to a JSON config file; defaults to './dappbotConfig.json'.  \nAll of the file's keys will be treated like options.")
	.argv
	