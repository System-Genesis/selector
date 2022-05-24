import { record } from './recordType';

export type mergedRecord = { updatedAt: Date; record: record };

export type identifiers = {
  personalNumber?: string | undefined;
  identityCard?: string | undefined;
  goalUser?: string | undefined;
};

export type mergedObj = {
  aka?: mergedRecord[];
  eightSocks?: mergedRecord[];
  sf?: mergedRecord[];
  city?: mergedRecord[];
  adNn?: mergedRecord[];
  adS?: mergedRecord[];
  mir?: mergedRecord[];

  identifiers: identifiers;
  _id?: string;
};
