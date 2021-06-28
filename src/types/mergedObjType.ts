import { record } from './recordType';

export type mergedRecord = { updatedAt: Date; record: record };

export type mergedObj = {
  aka?: { record: record; updatedAt: Date }[];
  eightSocks?: { record: record; updatedAt: Date }[];
  sf?: { record: record; updatedAt: Date }[];
  city?: { record: record; updatedAt: Date }[];
  adNn?: { record: record; updatedAt: Date }[];
  adS?: { record: record; updatedAt: Date }[];
  mir?: { record: record; updatedAt: Date }[];

  identifiers: {
    personalNumber: string;
    identityCard: string;
    goalUser: string;
  };
};
