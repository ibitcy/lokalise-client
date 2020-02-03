export interface IEnumOptions {
  name: string;
  phraseSeparator: string;
  separator: string;
}

export class Locale {
  public prefix = '';
  public readonly language: string;
  private readonly entities: Map<string, string>;

  public constructor(language: string, translations: Map<string, string>) {
    this.language = language;
    this.entities = new Map(translations);
  }

  public get translations(): Map<string, string> {
    const entitiesWithPrefix = new Map<string, string>();

    this.entities.forEach((translation, key) => {
      entitiesWithPrefix.set(`${this.prefix}${key}`, translation);
    });

    return entitiesWithPrefix;
  }

  public getEnum(options: IEnumOptions): string {
    let result = '';

    const formatPhraseToEnum = (phrase: string): string =>
      phrase.split(options.phraseSeparator).join(options.separator);

    const translations = this.translations;
    result += `export enum ${options.name} {\n`;

    translations.forEach((translation, key) => {
      result += `\t${formatPhraseToEnum(key)} = "${translation}",\n`;
    });

    result += `}\n`;

    return result;
  }
}
