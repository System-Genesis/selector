import { entity } from './entityType';

export type mergedObj = {
  aka?: { record: entity }[];
  eightSocks?: { record: entity }[];
  sf?: { record: entity }[];
  city?: { record: entity }[];
  adNn?: { record: entity }[];
  adS?: { record: entity }[];

  identifiers: {
    personalNumber: string;
    identityCard: string;
    goalUser: string;
  };
};
