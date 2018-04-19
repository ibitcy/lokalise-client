# lokalise-client
Client for lokalise.co

## Installation

`npm i lokalise-client --save-dev` or `yarn add lokalise-client`

## Usage examples

### First step. Create lokalise client.

```
const lokaliseClient = new LokaliseClient({
  token: '%token%',
  langs: ['en', 'ru'],
});
```

### Fetch project and save

```
lokaliseClient
.fetchProject({
  id: %projectId1%,
})
.then(project => {
  project
  .save('src/locale/')
  .then(languages => {
    languages.forEach(language => console.log('Locale successfully saved! ', language));
  })
  .catch(language => {
    console.log('Save locale failed! ', language)
  });
});
```

### Fetch several projects and save

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

### Check unused translations

```
lokaliseClient
.fetchProject({
  id: %projectId1%,
})
.then(project => {
  return project.getUnusedTranslationsKeys('./src/app/', 'en');
})
.then(notFoundKeys => {
  console.log(notFoundKeys);
});
```

## Locale

| Field | Type | Method | Description |
|-|-|-|-|
| language | `string` | `get` | Locale language |
| prefix | `string` | `get/set` | Prefix for translations keys |
| translations | `Map<string, string>` | `get` | Locale translations |

## Project

| Field | Type | Method | Description |
|-|-|-|-|
| id | `string` | `get` | Project unique identifier |
| defaultLanguage | `string` | `get/set` | Default language of project |
| prefix | `string` | `set` | Prefix of all locales in project |
| languages | `string[]` | `get` | List of languages in project |
| getUnusedTranslationsKeys | `Promise<string[]>` | `get` | Returns unused translations keys in your project directory |
