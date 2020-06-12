import fs from 'fs';
import path from 'path';

export function saveJsonToFile(dir: string, fileName: string, json: object) {
  saveFile(dir, fileName, JSON.stringify(json, undefined, 2));
}

export function saveFile(dir: string, fileName: string, content: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  fs.writeFileSync(path.resolve(process.cwd(), dir, fileName), content);
}

export function removeDirectory(dir: string) {
  fs.rmdirSync(dir, { recursive: true });
}

export function logMessage(message: string, level: 'success' | 'warning' | 'error') {
  const prefix = '[lokalise-client]';

  if (level === 'success') {
    console.debug(`\x1b[32m ${prefix} Success! ${message} \x1b[0m`);
  }

  if (level === 'error') {
    console.error(`\x1b[31m ${prefix} Error! ${message} \x1b[0m`);
  }

  if (level === 'warning') {
    console.warn(`\x1b[33m ${prefix} Warning! ${message} \x1b[0m`);
  }
}