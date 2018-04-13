# lokalise-client
Client for lokalise.co

## Installation

`npm i lokalise-client --save` or `yarn add lokalise-client`

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
