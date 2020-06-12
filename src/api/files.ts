import decompress, { File } from 'decompress';
import { IncomingMessage } from 'http';
import https from 'https';

import { Locale } from '../locale';
import { logMessage } from '../utils';

export async function fetchLocales(url: string): Promise<Locale[]> {
  const response = await getZipFile(url);
  const buffer = await mapZipFileToBuffer(response);
  const files = await decompress(buffer);

  return files.reduce<Locale[]>((acc, file) => {
    const locale = mapFileToLocale(file);

    if (locale) {
      acc.push(locale);
    }

    return acc;
  }, []);
}

async function getZipFile(url: string): Promise<IncomingMessage> {
  return new Promise(resolve => {
    https.get(url, res => {
      resolve(res);
    });
  });
}

async function mapZipFileToBuffer(
  incomingMessage: IncomingMessage,
): Promise<Buffer> {
  return new Promise(resolve => {
    const data: Uint8Array[] = [];

    incomingMessage
      .on('data', chunk => data.push(chunk))
      .on('end', () => {
        resolve(Buffer.concat(data));
      });
  });
}

function mapFileToLocale(file: File): Locale | undefined {
  if (file.type !== 'file') {
    return;
  }

  try {
    return new Locale(file.path, JSON.parse(file.data.toString('utf8')));
  } catch (error) {
    logMessage(file.path, 'error');
    logMessage(error, 'error');
  }
}
