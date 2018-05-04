# Lokalise-client [![npm version](https://img.shields.io/npm/v/lokalise-client.svg?style=flat)](https://www.npmjs.com/package/lokalise-client) [![Build Status](https://travis-ci.org/ibitcy/lokalise-client.svg?branch=master)](https://travis-ci.org/ibitcy/lokalise-client)
Client for lokalise.co

## Installation

`npm i lokalise-client --save-dev` or `yarn add lokalise-client`

## Usage examples

### Simple

* In your project dir create configuration file `translations.json` like this:
```
{
  "dist": "./src/locale/",
  "defaultLanguage": "en",
  "token": "%token%",
  "projects": [
    {
      "id": "%project_id%"
    }
  ]
}
```
* In your `package.json` file add command `"fetch-translations": "translations fetch --path ./translations.json"`
* In terminal run command `npm run fetch-translations`

### Pro

* Create file `translations.js` in your project dir
```
const lokaliseClient = new LokaliseClient({
  token: '%token%',
});

lokaliseClient
.fetchProject({
  id: %projectId%,
})
.then(project => {
  return project.save('./src/locales');
})
.then(languages => {
  languages.forEach(language => console.log('Locale successfully saved! ', language));
})
.catch(error => {
  console.log('Save locale failed! ', error)
});
```
* In your `package.json` file add command `"translations": "node translations"`
* In terminal run command `npm run translations`

### Load several projects. Merge projects. Save translations in file.

```
lokaliseClient
.fetchProjects([
  {
    id: %projectId1%,
  },
  {
    id: %projectId2%,
  },
])
.then(projects => {
  projects.forEach(project => {
    project.defaultLanguage = 'en';
  });

  return projects;
})
.then(projects => {
  const project = LokaliseClient.mergeProjects(projects, '%new project id');

  return project.save('./src/locales')
})
.then(languages => {
  languages.forEach(language => console.log('Locale successfully saved! ', language));
})
.catch(error => {
  console.log('Save locale failed! ', error)
});
```

### Find unused translations in project.

```
lokaliseClient
.fetchProject({
  id: %projectId%,
})
.then(project => {
  return project.getUnusedTranslationsKeys('./src/app/', 'en');
})
.then(notFoundKeys => {
  console.log(notFoundKeys);
});
```

### Add prefix for project translations.
```
lokaliseClient
.fetchProject({
  id: %projectId%,
})
.then(project => {
  project.prefix = '__SOME_PREFIX__.'

  // Another actions with project
});
```

### Set default language in project. If no translation for some key, take it from default language.
```
lokaliseClient
.fetchProject({
  id: %projectId%,
})
.then(project => {
  project.defaultLanguage = 'en';

  // Another actions with project
});
```

## Locale

| Field | Method | Description |
|-|-|-|
| language | `get` | Locale language |
| prefix | `get/set` | Prefix for translations keys |
| translations | `get` | Locale translations |

## Project

| Field | Method | Description |
|-|-|-|
| id | `get` | Project unique identifier |
| defaultLanguage | `get/set` | Default language of project |
| prefix | `set` | Prefix of all locales in project |
| languages | `get` | List of languages in project |
| getUnusedTranslationsKeys | `get` | Returns unused translations keys in your project directory |
