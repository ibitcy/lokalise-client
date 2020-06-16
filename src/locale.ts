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

  public getEnum(
    transformKey: (path: string[]) => string = path => path.join('_'),
  ): string {
    let result = '';

    result += `export enum Translations {\n`;

    const pathList = getObjectPathList(this._translations);

    pathList.forEach(path => {
      result += `\t${transformKey(path.slice())} = '${path.join(
        this.delimiter,
      )}',\n`;
    });

    result += `}\n`;

    return result;
  }

  public getTranslationsCount(): number {
    return Object.keys(this.getTranslations(true)).length;
  }
}

function getObjectPathList(target: Record<string, unknown>): string[][] {
  const result: string[][] = [];

  function step(temp: Record<string, unknown>, path?: string[]) {
    Object.keys(temp).forEach(key => {
      const value = temp[key];
      const newPath = path ? path.concat([key]) : [key];

      if (typeof value === 'object') {
        return step(value as Record<string, unknown>, newPath);
      }

      result.push(newPath);
    });
  }

  step(target);

  return result;
}
