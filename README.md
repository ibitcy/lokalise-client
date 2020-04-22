# Lokalise-client

[![build status](https://badgen.net/travis/ibitcy/lokalise-client?icon=travis)](https://travis-ci.org/ibitcy/lokalise-client)
[![npm downloads](https://badgen.net/npm/dt/lokalise-client?icon=npm&color=green)](https://www.npmjs.com/package/lokalise-client)

Easy fetch your translations from lokalise.co:
1. Install `npm i lokalise-client --save-dev` or `yarn add lokalise-client --dev`
2. Create configuration file `translations.json`
3. In your `package.json` file add command `"fetch-translations": "translations fetch --path ./translations.json"`
4. Run command `npm run fetch-translations`

### Basic configuration `translations.json`

```json
{
  "dist": "./src/locale/",
  "prefix": "locale.",
  "defaultLanguage": "en",
  "token": "%token%",
  "projects": [
    {
      "id": "%project_id%"
    }
  ],
  "enum": {
    "dist": "./src/types/",
    "name": "translations",
    "phraseSeparator": "|",
    "separator": "|"
  }
}
```

### Fetch several projects

```json
{
  "dist": "./src/locale/",
  "defaultLanguage": "en",
  "token": "%token%",
  "projects": [
    {
      "id": "%project_id%",
      "prefix": "__PROJECT_1__"
    },
    {
      "id": "%another_project_id%",
      "prefix": "__PROJECT_2__"
    }
  ]
}
```

### Find unused translations in project.

* Create file `translations.js` in your project dir
```js
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
* In your `package.json` file add command `"translations": "node translations"`
* In terminal run command `npm run translations`
