#! /usr/bin/env node

const { LokaliseClient } = require('../dist/client.js');
var pjson = require('../package.json');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version(pjson.version)
  .option('-P, --path <path>', 'Path to configuration file');

program.command('fetch').action((env, options) => {
  try {
    const pathToConfigFile = program.path || 'translations.json';

    const config = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), pathToConfigFile), 'utf8'),
    );

    const client = new LokaliseClient(config);
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
