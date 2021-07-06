import { record } from './recordType';

export type mergedRecord = { updatedAt: Date; record: record };

export type mergedObj = {
  aka?: mergedRecord[];
  eightSocks?: mergedRecord[];
  sf?: mergedRecord[];
  city?: mergedRecord[];
  adNn?: mergedRecord[];
  adS?: mergedRecord[];
  mir?: mergedRecord[];

  identifiers: {
    personalNumber?: string;
    identityCard?: string;
    goalUser?: string;
  };
};
