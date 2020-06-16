#! /usr/bin/env node

const { LokaliseClient } = require('../dist/client.js');
var pjson = require('../package.json');
const config = require('config');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program.version(pjson.version);

program
  .command('fetch')
  .description('Fetch your translations')
  .action((env, options) => {
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
