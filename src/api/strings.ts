import * as request from 'request';

import { TStrings } from '../models/strings';
import { logError } from '../utils';

export interface IGetProjectStringsOptions {
  api_token: string;
  icu_numeric?: number;
  id: string;
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
  return new Promise<TStrings | null>((resolve, reject) => {
    request.post(
      {
        formData: {
          api_token: options.api_token,
          icu_numeric: options.icu_numeric || 0,
          id: options.id,
          langs: JSON.stringify(
            Array.isArray(options.langs) ? options.langs : []
          ),
          placeholder_format: options.placeholder_format || 'icu',
          platform_mask: options.platform_mask || 4,
          plural_format: options.plural_format || 'icu'
        },
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
