import { getProjectStrings } from './api/strings';
import { Locale } from './locale';
import { Project } from './project';
import { unique } from './utils';
import { mergeMaps } from './utils';

export interface IConfig {
  langs: string[];
  token: string;
}

export interface IFetchProjectOptions {
  icu_numeric?: number;
  id: string;
  keys?: string[];
  placeholder_format?: string;
  platform_mask?: number;
  plural_format?: string;
  tags?: string[];
}

export class LokaliseClient {
  private readonly config: IConfig;

  public constructor(config: IConfig) {
    this.config = config;
  }

  public fetchProject(options: IFetchProjectOptions): Promise<Project> {
    return getProjectStrings({
      ...options,
      api_token: this.config.token,
      id: options.id,
      langs: this.config.langs,
    }).then(strings => {
      const locales: Locale[] = [];

      if (strings) {
        const languages = Object.keys(strings);

        languages.forEach(language => {
          const languageTranslations = strings[language];

          if (languageTranslations) {
            const translations = new Map<string, string>();

            languageTranslations.forEach(item => {
              translations.set(item.key, item.translation);
            });

            locales.push(new Locale(language, translations));
          }
        });
      }

      return new Project(options.id, locales);
    });
  }

  public fetchProjects(options: IFetchProjectOptions[]): Promise<Project[]> {
    const projects: Project[] = [];

    const addProject = (index: number): Promise<Project[]> => {
      return this.fetchProject(options[index])
        .then((project) => {
          projects.push(project);

          if (index < options.length - 1) {
            return addProject(index + 1);
          }

          return projects;
        });
    };

    return addProject(0);
  }

  public static mergeProjects(projectList: Project[], newProjectId: string): Project {
    let projectListLanguages: string[] = [];
    const newProjectLocales: Locale[] = [];

    projectList.forEach(project => {
      projectListLanguages = projectListLanguages.concat(project.languages);
    });

    projectListLanguages = unique(projectListLanguages);

    projectListLanguages.forEach(language => {
      let translations = new Map<string, string>();

      projectList.forEach(project => {
        translations = mergeMaps([translations, project.getTranslations(language)]);
      });

      newProjectLocales.push(new Locale(language, translations));
    });

    return new Project(newProjectId, newProjectLocales);
  }
}
