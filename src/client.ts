import type {
  DownloadedFileProcessDetails,
  DownloadFileParams,
  LokaliseApi,
  QueuedProcess,
} from '@lokalise/node-api';

import { fetchLocales } from './api/files';
import { Locale } from './locale';
import {
  logMessage,
  removeDirectory,
  saveFile,
  saveJsonToFile,
} from './utils';

interface Config {
  dist: string;
  projects: ReadonlyArray<ProjectConfig>;
  token: string;

  clean?: boolean;
  declaration?: DeclarationConfig;
  delimiter?: string;
  prefix?: string;
  useFlat?: boolean;
}

interface ProjectConfig extends Omit<DownloadFileParams, 'format'> {
  id: string;

  prefix?: string;
}

interface DeclarationConfig {
  dist: string;

  transformKey?(path: string[]): string;
}

const POLLING_INTERVAL = 3000;
const PROCESS_TIMEOUT = 5 * 60 * 1000;

let cachedApi: LokaliseApi | null = null;
async function getApi(apiKey: string): Promise<LokaliseApi> {
  if (cachedApi) return cachedApi;
  // Use native dynamic import to load ESM from CommonJS without TS transpiling to require()
  // tslint:disable-next-line:function-constructor
  const dynamicImport = new Function('spec', 'return import(spec)');
  const mod = await dynamicImport('@lokalise/node-api');
  const ApiCtor = (mod as any).LokaliseApi || (mod as any).default?.LokaliseApi;
  cachedApi = new ApiCtor({ apiKey });
  return cachedApi as unknown as LokaliseApi;
}

export class LokaliseClient {
  private readonly config: Config;
  private locales: Locale[] = [];

  public constructor(config: Config) {
    this.config = config;
  }

  public async fetchTranslations() {
    const { clean, declaration, dist, prefix, useFlat, token } = this.config;

    const api = await getApi(token);

    try {
      await Promise.all(
        this.config.projects.map(projectConfig =>
          this.fetchProject(api, projectConfig),
        ),
      );
    } catch (error) {
      logMessage('Fetching translations was failed', 'error');
      console.error(error);
      return;
    }

    if (this.locales.length === 0) {
      logMessage('Translations are empty', 'error');
      return;
    }

    if (clean) {
      removeDirectory(dist);
    }

    this.locales.forEach(locale => {
      saveJsonToFile(
        dist,
        `${prefix || ''}${locale.language}.json`,
        locale.getTranslations(useFlat),
      );
      logMessage(
        `Translations were saved ${
          locale.language
        }. Translations count: ${locale.getTranslationsCount()}`,
        'success',
      );
    });

    if (declaration) {
      saveFile(
        declaration.dist,
        'translations.ts',
        this.locales[0].getEnum(declaration.transformKey),
      );
      logMessage(`Declaration file was saved`, 'success');
    }
  }

  private async fetchProject(api: LokaliseApi, { prefix, id, ...shared }: ProjectConfig) {
    const { delimiter } = this.config;

    const response: {
      process_id: string;
    } = await api.files().async_download(id, {
      bundle_structure: '%LANG_ISO%',
      export_empty_as: 'base',
      format: 'json',
      indentation: '2sp',
      original_filenames: false,
      placeholder_format: 'icu',
      plural_format: 'icu',
      replace_breaks: false,
      ...shared,
    });

    const startTime = Date.now();
    let processInfo: QueuedProcess;

    while (true) {
      processInfo = await api
        .queuedProcesses()
        .get(response.process_id, { project_id: id });

      if (processInfo.status === 'finished') {
        break;
      }

      if (Date.now() - startTime > PROCESS_TIMEOUT) {
        throw new Error(
          'Process did not finish within the timeout period: ' +
            PROCESS_TIMEOUT +
            'ms',
        );
      }

      await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    }

    const locales = await fetchLocales(
      (processInfo.details as DownloadedFileProcessDetails).download_url,
    );

    const hasAlreadyFetchedProject = this.locales.length > 0;

    if (hasAlreadyFetchedProject) {
      const existedLanguages = this.locales.map(locale => locale.language);

      if (existedLanguages.length !== locales.length) {
        logMessage(`Projects have different languages`, 'warning');
      }

      locales.forEach(locale => {
        if (!existedLanguages.includes(locale.language)) {
          logMessage(
            `Projects have different languages ${locale.language}`,
            'warning',
          );
        }
      });
    }

    if (prefix) {
      locales.forEach(locale => locale.addPrefixToKeys(prefix));
    }

    if (delimiter) {
      locales.forEach(locale => (locale.delimiter = delimiter));
    }

    locales.forEach(locale => {
      this.addLocale(locale);
    });
  }

  private addLocale(locale: Locale) {
    const oldLocale = this.getLocale(locale.language);

    if (oldLocale) {
      oldLocale.addTranslations(locale.getTranslations());
    } else {
      this.locales.push(locale);
    }
  }

  private getLocale(language: string): Locale | undefined {
    return this.locales.find(locale => locale.language === language);
  }
}
