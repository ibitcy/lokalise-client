import flatten from 'flat';

export class Locale {
  public readonly language: string;
  
  private readonly delimiter: string;
  private _translations: Record<string, string>;

  public constructor(language: string, translations: object, delimiter = '::') {
    this.language = language;
    this.delimiter = delimiter;
    this._translations = flatten(translations, { delimiter });
  }

  public get translations(): Record<string, string> {
    return this._translations;
  }

  public addPrefixToKeys(prefix: string): Record<string, string> {
    const newTranslations: Record<string, string> = {};

    Object.keys(this._translations).forEach(key => {
      newTranslations[`${prefix}${key}`] = this._translations[key];
    });

    this._translations = newTranslations;

    return newTranslations;
  }

  public addTranslations(translations: object): Record<string, string> {
    const newTranslations: Record<string, string> = flatten(translations, { delimiter: this.delimiter });

    this._translations = {
      ...this._translations,
      ...newTranslations,
    };

    return this._translations;
  }

  public getEnum(): string {
    let result = '';

    result += `export enum Translations {\n`;

    Object.keys(this._translations).forEach(key => {
      const regExp = new RegExp(this.delimiter, 'g');
      result += `\t${key.replace(regExp, '_')} = '${key}',\n`;
    });

    result += `}\n`;

    return result;
  }
}
