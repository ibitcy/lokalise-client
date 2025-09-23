#! /usr/bin/env node

const { Command } = require('commander');
const config = require('config');
const fs = require('fs');
const path = require('path');
const pjson = require('../package.json');

const program = new Command();
program.version(pjson.version);

function resolveClient() {
  const distClientPath = path.resolve(__dirname, '../dist/client.js');
  if (fs.existsSync(distClientPath)) {
    // Prefer built JS when present
    return require(distClientPath);
  }
  // Fallback: register TS loader and load source directly
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('esbuild-register/dist/node').register({ target: 'es2020', format: 'cjs' });
  } catch (e) {
    console.error('\x1b[31mFailed to register TS loader (esbuild-register).\x1b[0m');
    throw e;
  }
  const srcClientPath = path.resolve(__dirname, '../src/client.ts');
  return require(srcClientPath);
}

program
  .command('fetch')
  .description('Fetch your translations')
  .action(async () => {
    try {
      const configuration = config.get('translations');
      const { LokaliseClient } = resolveClient();
      const client = new LokaliseClient(configuration);
      await client.fetchTranslations();
    } catch (error) {
      logError(error.message || String(error));
    }
  });

program.parse(process.argv);

function logError(error) {
  console.error('\x1b[41m', ' Error! ', '\x1b[0m');
  console.error('\x1b[31m' + error, '\x1b[0m');
}
