import * as fs from 'fs';
import * as path from 'path';

export function logError<T>(error: T) {
  console.error('System error! ', error);
}

export function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

export function mergeMaps<K, V>(maps: Array<Map<K, V> | null>): Map<K, V> {
  let merged = new Map<K, V>();

  maps.filter(Boolean).forEach(map => {
    merged = new Map<K, V>([...merged, ...map]);
  });

  return merged;
}

export function getFileData(filePath: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(path.resolve(filePath), 'utf8', (error, data) => {
      if (error) {
        return reject(error);
      }

      return resolve(data);
    });
  });
}

export function getDirFiles(dirPath: string): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    fs.readdir(path.resolve(dirPath), (error, files) => {
      if (error) {
        return reject(error);
      }

      return resolve(files);
    });
  });
}

export function fileHasString(filePath: string, searchString: string): Promise<boolean> {
  return getFileData(filePath).then(fileData => fileData.includes(searchString));
}

export interface ISearchResult {
  isFound: boolean;
  searchString: string;
}

export function dirHasString(dirPath: string, searchString: string): Promise<ISearchResult> {
  return new Promise<ISearchResult>((resolve, reject) => {
    return getDirFiles(path.resolve(dirPath))
      .then(items => {
        const files: string[] = [];
        const dirs: string[] = [];

        items.forEach(item => {
          const itemPath = path.resolve(dirPath, item);
          const itemStat = fs.lstatSync(itemPath);

          if (itemStat.isFile()) {
            files.push(itemPath);
          } else if (itemStat.isDirectory()) {
            dirs.push(itemPath);
          }
        });

        return {
          dirs,
          files,
        };
      })
      .then(({ dirs, files }) => {
        return Promise
        .all(files.map(file => fileHasString(file, searchString)))
        .then(filesHasString => {
          return {
            dirs,
            filesHasString: filesHasString.some(Boolean),
          };
        });
      })
      .then(({ dirs, filesHasString }) => {
        if (filesHasString) {
          return resolve({
            isFound: true,
            searchString,
          });
        } else {
          if (dirs.length === 0) {
            return resolve({
              isFound: false,
              searchString,
            });
          }

          return Promise.all(
            dirs.map(dir => dirHasString(dir, searchString)),
          )
          .then(result => {
            return resolve({
              isFound: result.some(({ isFound }) => isFound),
              searchString,
            });
          });
        }
      });
  });
}
