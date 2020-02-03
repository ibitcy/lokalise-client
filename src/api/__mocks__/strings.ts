import { TStrings } from '../../models/strings';
import { IGetProjectStringsOptions } from '../strings';

const project1: TStrings = {
  en: [
    {
      context: null,
      created_at: '2015-02-05 23:14:58',
      fuzzy: '0',
      is_archived: '0',
      is_hidden: '0',
      key: 'appstore::app::title',
      modified_at: '2015-02-05 23:21:20',
      platform_mask: 16,
      plural_key: null,
      tags: [],
      translation: 'Lokalise',
    },
    {
      context: null,
      created_at: '2015-02-05 23:17:27',
      fuzzy: '0',
      is_archived: '0',
      is_hidden: '0',
      key: 'index::welcome',
      modified_at: '2015-02-05 23:17:27',
      platform_mask: '3',
      plural_key: null,
      tags: ['tag 1', 'tag 2', 'tag 3'],
      translation: 'Joined string, for on iOS and Android',
    },
  ],
  ru: [
    {
      context: null,
      created_at: '2015-02-05 23:14:58',
      fuzzy: '0',
      is_archived: '0',
      is_hidden: '0',
      key: 'appstore::app::title',
      modified_at: '2015-02-05 23:21:20',
      platform_mask: 16,
      plural_key: null,
      tags: [],
      translation: 'Заголовок',
    },
  ],
};

const project2: TStrings = {
  en: [
    {
      context: null,
      created_at: '2015-02-05 23:14:58',
      fuzzy: '0',
      is_archived: '0',
      is_hidden: '0',
      key: 'appstore.app.title',
      modified_at: '2015-02-05 23:21:20',
      platform_mask: 16,
      plural_key: null,
      tags: [],
      translation: 'Title',
    },
  ],
  es: [
    {
      context: null,
      created_at: '2015-02-05 23:14:58',
      fuzzy: '0',
      is_archived: '0',
      is_hidden: '0',
      key: 'appstore.app.title',
      modified_at: '2015-02-05 23:21:20',
      platform_mask: 16,
      plural_key: null,
      tags: [],
      translation: 'Título',
    },
  ],
};

export function getProjectStrings(options: IGetProjectStringsOptions): Promise<TStrings | null> {
  if (options.id === '2') {
    return Promise.resolve(project2);
  }

  return Promise.resolve(project1);
}
