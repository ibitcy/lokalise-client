import * as request from 'request';

import { TStrings } from '../models/strings';
import { logError } from '../utils';

export interface IGetProjectStringsOptions {
  api_token: string;
  id: string;

  icu_numeric?: number;
  keys?: string[];
  langs?: string[];
  placeholder_format?: string;
  platform_mask?: number;
  plural_format?: string;
  tags?: string[];
}

export interface IGetProjectStringsResponse {
  strings?: TStrings;
}

export function getProjectStrings(
  options: IGetProjectStringsOptions
): Promise<TStrings | null> {
  const defaultOptions: Partial<IGetProjectStringsOptions> = {
    icu_numeric: 0,
    placeholder_format: 'icu',
    platform_mask: 4,
    plural_format: 'icu'
  };

  const mergedOptions: IGetProjectStringsOptions = {
    ...defaultOptions,
    ...options
  };

  return new Promise<TStrings | null>((resolve, reject) => {
    request.post(
      {
        formData: mergedOptions,
        url: 'https://api.lokalise.co/api/string/list'
      },
      (err, httpResponse, body: string) => {
        if (err) {
          logError(err);
          reject(null);

          return;
        }

        try {
          const data: IGetProjectStringsResponse = JSON.parse(
            body
          ) as IGetProjectStringsResponse;
          if (data && data.strings) {
            resolve(data.strings);
          } else {
            reject(null);
          }
        } catch (error) {
          logError(error);
          reject(null);
        }
      }
    );
  });
}
