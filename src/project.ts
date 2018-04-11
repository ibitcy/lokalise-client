import * as fs from 'fs';

import { Locale } from './locale';

export class Project {
  public readonly id: string;
  private readonly locales: Array<Locale> = [];

  public defaultLanguage = '';

  public constructor(id: string, locales: Array<Locale>) {
    this.id = id;
    this.locales = locales.slice();
  }

  public set prefix(prefix: string) {
    this.locales.forEach(locale => {
      locale.prefix = prefix;
    });
  }

  public get languages(): string[] {
    return this.locales.map(locale => locale.language);
  }

  public getTranslations(language: string): Map<string, string> | null {
    const locale = this.locales.find(item => item.language === language);

    if (locale) {
      const { translations } = locale;

      if (this.defaultLanguage && language !== this.defaultLanguage) {
        const defaultTranslations = this.defaultTranslations;

        if (defaultTranslations) {
          const mergedTranslations = new Map<string, string>();

          defaultTranslations.forEach((translation, key) => {
            const currentTranslation = translations.get(key);
            if (currentTranslation) {
              mergedTranslations.set(key, currentTranslation);
            } else {
              mergedTranslations.set(key, translation);
            }
          });

          return mergedTranslations;
        }

        return translations;
      }

      return translations;
    }

    return null;
  }

  public getFormattedTranslations(language: string): object {
    const translations = this.getTranslations(language);
    const result: { [index: string]: string } = {};

    if (translations) {
      translations.forEach((translation, key) => {
        result[key] = translation;
      });
    }

    return result;
  }

  public save(path: string): Promise<string[]> {
    return Promise.all(this.languages.map(language => this.saveTranslation(path, language)));
  }

  private saveTranslation(path: string, language: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const content = JSON.stringify(this.getFormattedTranslations(language), null, 4);

      fs.writeFile(`${path}${language}.json`, content, (err) => {
        if (err) {
          reject(language);

          return;
        }

        resolve(language);
      });
    });
  }

  private get defaultTranslations(): Map<string, string> | null {
    const defaultLocale = this.locales.find(item => item.language === this.defaultLanguage);

    if (!defaultLocale) {
      return null;
    }

    return defaultLocale.translations;
  }
}
