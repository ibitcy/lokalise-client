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

  const client = new LokaliseClient({
    token: config.token,
  });

  client
    .fetchProjects(config.projects)
    .catch(error => {
      logError(`Fetch projects was failed! ${error}`);

      throw new Error(error);
    })
    .then(projects => {
      projects.forEach(project => {
        const projectParams = config.projects.find(({ id }) => id === project.id);
        project.defaultLanguage = config.defaultLanguage;

        if (projectParams) {
          if (projectParams.prefix) {
            project.prefix = projectParams.prefix;
          }

          if (projectParams.defaultLanguage) {
            project.defaultLanguage = projectParams.defaultLanguage;
          }
        }
      });

      return projects;
    })
    .then(projects => {
      const project = LokaliseClient.mergeProjects(projects, 'merged');

      const dist = path.format({
        dir: config.dist,
      });

      if (config.enum) {
        project.saveEnum(dist, config.enum);
      }

      return project.save(dist);
    })
    .catch(error => {
      logError(`Saving translation was failed! ${error}`);

      throw new Error(error);
    })
    .then(languages => {
      languages.forEach(language =>
        logMessage(`Saving translation was successful: ${language}`),
      );
    });
});

program.parse(process.argv);

function logError(error) {
  console.error('\x1b[41m', ' Error! ', '\x1b[0m');
  console.error('\x1b[31m' + error, '\x1b[0m');
}

function logMessage(message) {
  console.error('\x1b[32m' + message, '\x1b[0m');
}
