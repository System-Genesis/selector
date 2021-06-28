import { record } from './recordType';

export type mergedObj = {
  aka?: { record: record }[];
  eightSocks?: { record: record }[];
  sf?: { record: record }[];
  city?: { record: record }[];
  adNn?: { record: record }[];
  adS?: { record: record }[];
  mir?: { record: record }[];

  identifiers: {
    personalNumber: string;
    identityCard: string;
    goalUser: string;
  };
};
