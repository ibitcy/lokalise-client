import { DownloadFileParams, LokaliseApi } from '@lokalise/node-api';

import { fetchLocales } from './api/files';
import { Locale } from './locale';
import { logMessage, removeDirectory, saveFile, saveJsonToFile } from './utils';

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
}

export class LokaliseClient {
  private readonly api: LokaliseApi;
  private readonly config: Config;
  private locales: Locale[] = [];

  public constructor(config: Config) {
    this.api = new LokaliseApi({
      apiKey: config.token,
    });

    this.config = config;
  }

  public async fetchTranslations() {
    const { clean, declaration, dist, prefix, useFlat } = this.config;

    try {
      await Promise.all(
        this.config.projects.map(projectConfig =>
          this.fetchProject(projectConfig),
        ),
      );
    } catch (error) {
      logMessage(error, 'error');
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
      logMessage(`Translations were saved ${locale.language}`, 'success');
    });

    if (declaration) {
      saveFile(declaration.dist, 'translations.ts', this.locales[0].getEnum());
      logMessage(`Declaration was saved`, 'success');
    }
  }

  private async fetchProject({ prefix, id, ...shared }: ProjectConfig) {
    const { delimiter } = this.config;

    const response: {
      bundle_url: string;
      project_id: string;
    } = await this.api.files.download(id, {
      bundle_structure: '%LANG_ISO%',
      export_empty_as: 'base',
      format: 'json',
      indentation: '2sp',
      original_filenames: false,
      placeholder_format: 'icu',
      plural_format: 'icu',
      ...shared,
    });

    const locales = await fetchLocales(response.bundle_url);

    const hasAlreadyFetchedProject = this.locales.length > 0;

    if (hasAlreadyFetchedProject) {
      const existedLanguages = this.locales.map(locale => locale.language);

      if (existedLanguages.length !== locales.length) {
        logMessage(`Projects have different languages`, 'warning');
      }

      locales.forEach(locale => {
        if (!existedLanguages.includes(locale.language)) {
          logMessage(`Projects have different languages`, 'warning');
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
