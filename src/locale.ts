import flatten from 'flat';
import merge from 'deepmerge';

export class Locale {
  public delimiter = '.';
  public readonly language: string;

  private _translations: Record<string, unknown>;

  public constructor(language: string, translations: Record<string, unknown>) {
    this.language = language;
    this._translations = translations;
  }

  public getTranslations(useFlat = false): Locale['_translations'] {
    if (useFlat) {
      return flatten(this._translations, {
        delimiter: this.delimiter,
      });
    }

    return this._translations;
  }

  public addPrefixToKeys(prefix: string): Locale['_translations'] {
    const newTranslations: Record<string, unknown> = {};

    Object.keys(this._translations).forEach(key => {
      newTranslations[`${prefix}${key}`] = this._translations[key];
    });

    this._translations = newTranslations;

    return this._translations;
  }

  public addTranslations(
    newTranslations: Record<string, unknown>,
  ): Locale['_translations'] {
    this._translations = merge(this._translations, newTranslations);

    return this._translations;
  }

  public getEnum(): string {
    const ENUM_DELIMITER = '_';
    const translations: Record<string, string> = flatten(this._translations, {
      delimiter: ENUM_DELIMITER,
    });
    let result = '';

    result += `export enum Translations {\n`;

    Object.keys(translations).forEach(key => {
      const regExp = new RegExp(ENUM_DELIMITER, 'g');
      result += `\t${key} = '${key.replace(regExp, this.delimiter)}',\n`;
    });

    result += `}\n`;

    return result;
  }
}
