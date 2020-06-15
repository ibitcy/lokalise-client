# ⚙️ Lokalise-client

[![build status](https://badgen.net/travis/ibitcy/lokalise-client?icon=travis)](https://travis-ci.org/ibitcy/lokalise-client)
[![npm downloads](https://badgen.net/npm/dt/lokalise-client?icon=npm&color=green)](https://www.npmjs.com/package/lokalise-client)

Easy way to fetch your translations from lokalise.co.

Based on official [node-lokalise-api](https://github.com/lokalise/node-lokalise-api).

## How to install

```sh
npm i lokalise-client --save-dev
```

or

```sh
yarn add lokalise-client --dev
```

## Configuration

Add `translations.json` file in root of your project. Basic example:


```json
{
  "dist": "./src/locale/",
  "token": "%token%",
  "projects": [
    {
      "id": "%project_id%"
    }
  ]
}
```

You can define several projects. Also you can extend project params by [official lokalise api](https://app.lokalise.com/api2docs/curl/#transition-download-files-post).

## Fetch translations

In your `package.json` file add command `"fetch-translations": "translations fetch"`.

Run command `npm run fetch-translations`.

## Additional options

If you want to save translations files with some prefix, add `prefix` param.

If you want to clean directory with translations each time, set `clean` param to `true`.

If you want to save your translations as flat object, set `useFlat` to `true` and define `delimiter` param.

If you want to save declaration file for your translations, define `declaration` param:
```json
"declaration": {
  "dist": "src/models"
}
```
