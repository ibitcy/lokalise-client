import { getProjectStrings } from './api/strings';
import { Locale } from './locale';
import { Project } from './project';
import { unique } from './utils';
import { mergeMaps } from './utils';

export interface IConfig {
  langs: string[];
  token: string;
}

export class LokaliseClient {
  private readonly config: IConfig;

  public constructor(config: IConfig) {
    this.config = config;
  }

  public fetchProject(projectId: string): Promise<Project> {
    return getProjectStrings({
      langs: this.config.langs,
      projectId,
      token: this.config.token,
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

      return new Project(projectId, locales);
    });
  }

  public fetchProjects(projectIds: string[]): Promise<Project[]> {
    const projects: Project[] = [];

    const addProject = (index: number): Promise<Project[]> => {
      return this.fetchProject(projectIds[index])
        .then((project) => {
          projects.push(project);

          if (index < projectIds.length - 1) {
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
