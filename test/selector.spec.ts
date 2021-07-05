import { findNewestRecord } from '../src/selector/selector';
import { selector } from '../src/selector/selector';

let warnStr = '';
let infoStr = '';

jest.mock('../src/logger/logger', () => ({
  logInfo: (str: string, _: any) => (infoStr = str),
  logWarn: (str: string, _: any) => (warnStr = str),
}));

jest.mock('../src/rabbit/rabbit', () => {
  return {
    default: jest.fn(),
    sendToEntityQueue: () => {},
    sendToRogdQueue: () => {},
  };
});

describe('selector', () => {
  describe('selector', () => {
    it('Should fall because only mir source', () => {
      selector({ mir: [{ record: {}, updatedAt: new Date() }], identifiers: {} });

      expect(warnStr.includes('mir')).toBeTruthy;
    });

    it("Should didn't fall when has mir source", () => {
      selector({
        mir: [{ record: {}, updatedAt: new Date() }],
        aka: [{ record: {}, updatedAt: new Date() }],
        identifiers: {},
      });

      expect(warnStr.includes('mir')).toBeFalsy;
    });

    it('Should fall because C without identityCard', () => {
      selector({
        aka: [{ record: { entityType: 'digimon' }, updatedAt: new Date() }],
        identifiers: { personalNumber: '1621441' },
      });
      expect(warnStr.includes('C without identityCard')).toBeTruthy;
    });

    it('Should fall because C without personalNumber', () => {
      selector({
        aka: [{ record: { entityType: 'agumon' }, updatedAt: new Date() }],
        identifiers: { identityCard: '1621441' },
      });
      expect(warnStr.includes('S without personal number')).toBeTruthy;
    });

    it('Should send only to entity', () => {
      selector({
        aka: [{ record: { entityType: 'digimon' }, updatedAt: new Date() }],
        identifiers: { identityCard: '1621441' },
      });
      expect(infoStr.includes('Send To build Entity queue')).toBeTruthy;
    });

    it('Should send also to rogd', () => {
      selector({
        eightSocks: [{ record: { entityType: 'digimon', userId: 'ds' }, updatedAt: new Date() }],
        identifiers: { identityCard: '1621441' },
      });
      expect(infoStr.includes('Rogd')).toBeTruthy;
    });
  });

  describe('findNewestRecord', () => {
    it('Should return sf', () => {
      let mergeObj = {
        aka: [{ record: { firstName: 'a', personalNumber: '1621441' }, updatedAt: new Date(10) }],
        eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
        sf: [{ record: { firstName: 'sf' }, updatedAt: new Date(20) }],
        city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
        adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
        adS: [{ record: { firstName: 'f' }, updatedAt: new Date(15) }],
        mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

        identifiers: {
          personalNumber: '1621441',
          identityCard: '15154561',
        },
      };

      const res = findNewestRecord(mergeObj);

      expect(res.firstName).toBe('sf');
    });

    it('Should return ads', () => {
      let mergeObj = {
        aka: [{ record: { firstName: 'a', personalNumber: '1621441' }, updatedAt: new Date(10) }],
        eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
        sf: [{ record: { firstName: 'sf' }, updatedAt: new Date(12) }],
        city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
        adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
        adS: [{ record: { firstName: 'ads' }, updatedAt: new Date(20) }],
        mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

        identifiers: {
          personalNumber: '1621441',
          identityCard: '15154561',
        },
      };

      const res = findNewestRecord(mergeObj);

      expect(res.firstName).toBe('ads');
    });
  });
});
