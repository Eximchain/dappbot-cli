#!/usr/bin/env node
import yargs, { Arguments } from 'yargs';
import fs from 'fs';
import path from 'path';
import { loadFileFromPath, addDefaultAuthPath, addDefaultConfigFile } from './services';

export const npmPackage = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../package.json')).toString());

export const DEFAULT_CONFIG_PATH = './dappbotConfig.json';
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
			hidden: true,
			description: `The path to a JSON file with saved DappBot auth data; defaults to ${__dirname}/dappbotAuthData.json.`
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
	.middleware(addDefaultAuthPath)
	.middleware(addDefaultConfigFile)
	.middleware(loadFileFromPath)
	.commandDir('rootCmds')
	.usage('Usage: dappbot <command>')
	.demandCommand(1)
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
	