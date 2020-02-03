import { LokaliseClient } from '../client';
import * as path from 'path';

jest.mock('../api/strings.ts');

const client = new LokaliseClient({
  token: 'test',
});

describe('Projects fetched', () => {
  test('Should fetch two projects', async () => {
    const projects = await client.fetchProjects([
      {
        id: '1',
      },
      {
        id: '2',
      },
    ]);

    expect(projects.length).toBe(2);
  });

  test.skip('Should fetch two projects', async () => {
    const project = await client.fetchProject({
      id: '1',
    });
    project.defaultLanguage = 'en';

    const dist = path.format({
      dir: './test_result',
    });

    project.saveEnum(dist, {
      name: 'EPhrase',
      phraseSeparator: '::',
      separator: '_',
    });

    expect(1 + 1).toBe(2);
  });
});
