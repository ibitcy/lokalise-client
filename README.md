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
  "clean": true,
  "dist": "./src/locale/",
  "prefix": "locale.",
  "token": "%token%",
  "projects": [
    {
      "id": "%project_id%"
    }
  ],
  "enum": {
    "dist": "./src/types/"
  }
}
```

### Fetch several projects

```json
{
  "clean": true,
  "dist": "./src/locale/",
  "prefix": "locale.",
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