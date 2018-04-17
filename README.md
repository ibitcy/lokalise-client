# lokalise-client
Client for lokalise.co

## Installation

`npm i lokalise-client --save-dev` or `yarn add lokalise-client`

## Usage example

```
const client = new LokaliseClient({
  token: '%token%',
  langs: ['en', 'ru'],
});

client
.fetchProjects(['%projectId1%', '%projectId2%'])
.then(projects => {
  projects.forEach(project => {
    project.defaultLanguage = 'en';
  });

  return projects;
})
.then(projects => {
  const project = LokaliseClient.mergeProjects(projects, '%new project id');

  project
  .save('src/locale/')
  .then(languages => {
    languages.forEach(language => console.log('Processed: ', language));
  })
  .catch(language => {
    console.log('Save locale failed! ', language)
  });
});
```

## Locale

| Field | Type | Method | Description |
|-|-|-|-|
| language | `string` | `get` | Readonly. Locale language |
| prefix | `string` | `get/set` | Prefix for translations keys |
| translations | `Map<string, string>` | `false` | Locale translations |

## Project

| Field | Type | Readonly | Description |
|-|-|-|-|
| id | `string` | `true` | Project unique identifier |
| defaultLanguage | `string` | `false` | Get/set default language of project |
| prefix | `string` | `false` | Set prefix of all locales in project |
| languages | `string[]` | `false` | Get list of languages in project |
