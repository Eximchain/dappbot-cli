import React from 'react';
import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import { fastRender, pathExists, isTruffleArtifact, TruffleArtifact, requireAuthData } from "../services";
import { App, TruffleFlow, ErrorBox } from "../ui";
import { ArgShape, UniversalArgs } from "../cli";
import { Argv } from 'yargs';

export const command = 'truffle';

export const desc = "Run in a Truffle project directory to make a dapp for one of your deployed contracts.";

export function builder(yargs: Argv<UniversalArgs>) {
  yargs.middleware(requireAuthData);
}

export function handler(args:ArgShape) {
  const thisDir = process.cwd();
  const authFile = args.authFile
  if (typeof authFile === 'undefined') return fastRender(
    <ErrorBox errMsg={"This command needs to be run with an active login!  Make sure you have run `dappbot login` in your current directory."} />
  )

  if (!pathExists(['truffle.js', 'truffle-config.js'], thisDir)) return fastRender(
    <ErrorBox errMsg={"This command needs to be run in a Truffle project directory!  We could not find a truffle.js or truffle-config.js file."}/>
  )

  if (!pathExists('./build/contracts', thisDir)) return fastRender(
    <ErrorBox errMsg={"This command needs to be run in a Truffle project directory!  We could not find a ./build/contracts directory."} />
  )

  // Fetch all the files in there
  const artifactDir = path.resolve(thisDir, './build/contracts');
  const artifactFilenames = shell.ls(artifactDir).filter(name => name.endsWith('.json'));
  // console.log('Found artifact filenames: ',artifactFilenames);
  const unfilteredArtifacts:TruffleArtifact[] = artifactFilenames.map(filename => {
    const artifact = JSON.parse(fs.readFileSync(path.resolve(artifactDir, filename)).toString())
    if (artifact.contractName) artifact.contract_name = artifact.contractName;
    return artifact;
  })

  const artifacts = unfilteredArtifacts.filter(artifact => isTruffleArtifact(artifact) && artifact.contract_name !== 'Migrations')

  if (artifacts.length === 0) {
    return fastRender(
      <ErrorBox errMsg={`There haven't been any contracts built!  We couldn't find any JSON build artifacts in ${artifactDir}`} />
    )
  }

  // Filter for the ones which have values inside their "network" key
  const deployedArtifacts = artifacts.filter(artifact => {
    if (!artifact.networks) return false;
    return Object.keys(artifact.networks).length > 0;
  })

  if (deployedArtifacts.length === 0) {
    return fastRender(
      <ErrorBox errMsg={`We found ${artifacts.length} built contracts, but none of them have been deployed to a network!  Make sure you have properly deployed your contract before trying to create a a Dapp for it.`} />
    )
  }

  // artifacts.forEach(artifact => console.log(Object.keys(artifact.networks)))
  // console.log('now with parseInt')
  // artifacts.forEach(artifact => console.log(Object.keys(artifact.networks).map(parseInt)))

  // Got deployable artifacts, good to go!
  fastRender(
    <App args={args} renderFunc={props => <TruffleFlow {...props} artifacts={deployedArtifacts} authFile={authFile}  />}/>
  )
}