import { TBooleanString } from './common';

export type TStrings = Record<string, IKey[]>;

export interface IKey {
  context: null;
  created_at: string;
  fuzzy: TBooleanString;
  is_archived: TBooleanString;
  is_hidden: TBooleanString;
  key: string;
  modified_at: string;
  platform_mask: number | string;
  plural_key: null;
  tags: string[];
  translation: string;
}
