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
  if (!program.path) {
    logError(
      'Path to configuration file is required param! Add --path parameter!',
    );
    return;
  }

  let config;

  try {
    config = JSON.parse(fs.readFileSync(path.resolve(program.path), 'utf8'));
  } catch (error) {
    logError(error.message);
    return;
  }

  const client = new LokaliseClient(config);

  client.fetchTranslations();
});

program.parse(process.argv);
