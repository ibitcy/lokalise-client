#! /usr/bin/env node

const { Command } = require('commander');
const config = require('config');
const pjson = require('../package.json');
const { LokaliseClient } = require('../dist/client.js');

const program = new Command();
program.version(pjson.version);

program
  .command('fetch')
  .description('Fetch your translations')
  .action(() => {
    try {
      const configuration = config.get('translations');
      const client = new LokaliseClient(configuration);
      client.fetchTranslations();
    } catch (error) {
      logError(error.message);
    }
  });

program.parse(process.argv);

function logError(error) {
  console.error('\x1b[41m', ' Error! ', '\x1b[0m');
  console.error('\x1b[31m' + error, '\x1b[0m');
}
