#! /usr/bin/env node

const { LokaliseClient } = require('../dist/client.js');
var pjson = require('../package.json');
const program = require('commander');
const fs = require('fs');
const path = require('path');

program
  .version(pjson.version)
  .option('-P, --path <path>', 'Path to configuration file');

program
  .command('fetch')
  .action((env, options) => {
    if (!program.path) {
      console.error('Path to configuration file is required param! Add --path parameter!')
      return;
    }

    let config;

    try {
      config = JSON.parse(fs.readFileSync(path.resolve(program.path), 'utf8'));
    } catch(error) {
      console.error(error.message);
      return;
    }

    const client = new LokaliseClient({
      token: config.token
    });

    client
      .fetchProjects(config.projects)
      .then(projects => {
        projects.forEach(project => {
          const params = config.projects.find(({ id }) => id === project.id);
          project.defaultLanguage = config.defaultLanguage;

          if (params && params.prefix) {
            project.prefix = params.prefix;
          }
        });

        return projects;
      })
      .then(projects => {
        const project = LokaliseClient.mergeProjects(projects, 'merged');

        const dist = path.format({
          dir: config.dist
        });

        return project.save(dist);
      })
      .then(languages => {
        languages.forEach(language =>
          console.log('Saving translation was successful: ', language)
        );
      })
      .catch(error => {
        console.log('Saving translation was failed! ', error);
      });
  });

program.parse(process.argv);
