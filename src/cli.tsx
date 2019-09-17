#!/usr/bin/env node
import yargs from 'yargs';
import fs from 'fs';
import path from 'path';

const npmPackage = JSON.parse(fs.readFileSync(path.resolve(__dirname, './../package.json')).toString());

yargs
  .commandDir('rootResources')
  .demandCommand()
	.help('help')
	.alias('help', 'h')
	.version(npmPackage.version)
	.alias('version', 'v')
	.epilog('© Eximchain Pte. Ltd.')
  .argv