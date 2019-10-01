# dappbot-cli

`@eximchain/dappbot-cli` makes it easy to interact with the DappBot API straight from your terminal, making smart contract development faster & easier than ever before.  It is built on top of `yargs`, which provides excellent usage information when the user's command does not match or includes the `--help` option.  You can explore this help information directly, but here is a sample of its output for (1) the CLI as a whole, and (2) the `dappbot api` sub-commands.

## Install

```bash
$ npm install --global @eximchain/dappbot-cli
```

## Usage

Note that the below output is from development, which is why the commands are prefixed with `cli.js`.  On your own machine, you would simply call `dappbot api` or `dappbot truffle`.

### Overall Help

```
$ dappbot

Usage: dappbot <command>

Commands:
  cli.js api <resource/method> [args]  Access all of DappBot API methods,
                                       organized by their endpoints.

  cli.js billing                       Visit DappBot's billing page to update
                                       your payment info or dapp capacity.

  cli.js goto <DappName>               Visit one of the dapps hosted on DappHub.

  cli.js login                         Begin a persistent session with DappBot.

  cli.js signup                        Create a new account with DappBot.

  cli.js truffle                       Run in a Truffle project directory to
                                       make a dapp for one of your deployed
                                       contracts.

URL Options:
  --apiUrl   The URL for DappBot's API.        [default: "https://api.dapp.bot"]

  --mngrUrl  The URL for DappBot's management app  [default: "https://dapp.bot"]

  --hubUrl   The URL for DappHub.              [default: "https://hub.dapp.bot"]

Options:
  --authPath, -a  The path to a JSON file with saved DappBot auth data. [string]

  --config        Path to a JSON config file; all of the file's keys will be
                  treated like options.
```

### API Methods

```
$ dappbot api

cli.js api <resource/method> [args]

Access all of DappBot API methods, organized by their endpoints.

Commands:

  cli.js api auth/beginPassReset            Request to have your password reset.
  <username>

  cli.js api auth/confirmPassReset          Confirm a password reset.
  <username> <newPassword>
  <passwordResetCode>

  cli.js api auth/login <username>          Login to DappBot.
  <password>

  cli.js api auth/refresh <refreshToken>    Use your RefreshToken to get fresh
                                            Authorization.

  cli.js api private/createDapp <DappName>  Create a new Dapp.

  cli.js api private/deleteDapp <DappName>  Delete one of your Dapps.

  cli.js api private/listDapps              List your Dapps.

  cli.js api private/readDapp <DappName>    Read the details for one of your
                                            Dapps.

  cli.js api private/updateDapp <DappName>  Update one of your Dapps.

  cli.js api public/viewDapp <DappName>     View the public details of any
                                            deployed Dapp.
```