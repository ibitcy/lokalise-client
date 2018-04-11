export class Locale {
  public readonly language: string;
  private readonly entities: Map<string, string>;

  public prefix = '';

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
}
