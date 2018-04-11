import * as request from 'request';

import { TStrings } from '../models/strings';
import { logError } from '../utils';

export interface IGetProjectStringsOptions {
  token: string;
  projectId: string;
  langs: string[];
}

export interface IGetProjectStringsResponse {
    strings?: TStrings;
}

export function getProjectStrings(options: IGetProjectStringsOptions): Promise<TStrings | null> {
  return new Promise<TStrings | null>((resolve, reject) => {
    request.post({
        formData: {
            api_token: options.token,
            icu_numeric: 0,
            id: options.projectId,
            langs: JSON.stringify(options.langs),
            placeholder_format: 'icu',
            platform_mask: 4,
            plural_format: 'icu',
        },
        url: 'https://api.lokalise.co/api/string/list',
    }, (err, httpResponse, body: string) => {
        if (err) {
            logError(err);
            reject(null);

            return;
        }

        try {
            const data: IGetProjectStringsResponse = JSON.parse(body) as IGetProjectStringsResponse;
            if (data && data.strings) {
                resolve(data.strings);
            } else {
                reject(null);
            }
        } catch (error) {
            logError(error);
            reject(null);
        }
    });
  });
}
