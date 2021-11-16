import { findNewestRecord } from '../src/util/util';
import { selector } from '../src/selector/selector';
import { runType } from '../src/types/runType';
import { onlyMir } from '../src/selector/entityHandler';

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
      selector({
        sf: [{ record: { entityType: 'agumon', firstName: 'sf', personalNumber: '1621441' }, updatedAt: new Date() }],
        identifiers: {},
      });

      expect(warnStr.includes('sf')).toBeTruthy();
    });

    it("Should didn't fall when has mir source", () => {
      selector({
        mir: [{ record: { entityType: 'agumon', firstName: 'sf' }, updatedAt: new Date() }],
        aka: [{ record: { entityType: 'agumon', firstName: 'sf', personalNumber: '1621441' }, updatedAt: new Date() }],
        identifiers: {},
      });

      expect(warnStr.includes('mir')).toBeFalsy;
    });

    it('Should fall because C without identityCard', () => {
      selector({
        aka: [{ record: { firstName: 'sf', entityType: 'digimon' }, updatedAt: new Date() }],
        identifiers: { personalNumber: '1621441' },
      });
      expect(warnStr.includes('C without identityCard')).toBeTruthy();
    });

    it('Should fall because C without personalNumber', () => {
      selector({
        aka: [{ record: { entityType: 'agumon', firstName: 'sf' }, updatedAt: new Date() }],
        identifiers: { identityCard: '1621441' },
      });
      expect(warnStr.includes('S without personal number')).toBeTruthy();
    });

    it('Should send only to entity', () => {
      selector({
        aka: [{ record: { entityType: 'digimon', firstName: 'sf', identityCard: '1621441' }, updatedAt: new Date() }],
        identifiers: { identityCard: '1621441' },
      });
      expect(infoStr.includes('Entity queue')).toBeTruthy();
    });

    it('Should send also to rogd', () => {
      selector({
        eightSocks: [
          { record: { firstName: 'sf', entityType: 'digimon', userID: 'ds' } as any, updatedAt: new Date() },
        ],
        identifiers: { identityCard: '1621441' },
      });
      expect(infoStr.includes('Rogd')).toBeTruthy();
    });
  });

  describe('findNewestRecord', () => {
    it('Should return sf', () => {
      let mergeObj = {
        aka: [{ record: { entityType: 'agumon', firstName: 'a', personalNumber: '1621441' }, updatedAt: new Date(10) }],
        eightSocks: [{ record: { entityType: 'agumon', firstName: 'b' }, updatedAt: new Date(11) }],
        sf: [{ record: { entityType: 'agumon', firstName: 'sf' }, updatedAt: new Date(20) }],
        city: [{ record: { entityType: 'agumon', firstName: 'c' }, updatedAt: new Date(13) }],
        adNn: [{ record: { entityType: 'agumon', firstName: 'e' }, updatedAt: new Date(14) }],
        adS: [{ record: { entityType: 'agumon', firstName: 'f' }, updatedAt: new Date(15) }],
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
        aka: [{ record: { entityType: 'agumon', firstName: 'a', personalNumber: '1621441' }, updatedAt: new Date(10) }],
        eightSocks: [{ record: { entityType: 'agumon', firstName: 'b' }, updatedAt: new Date(11) }],
        sf: [{ record: { entityType: 'agumon', firstName: 'sf' }, updatedAt: new Date(12) }],
        city: [{ record: { entityType: 'agumon', firstName: 'c' }, updatedAt: new Date(13) }],
        adNn: [{ record: { entityType: 'agumon', firstName: 'e' }, updatedAt: new Date(14) }],
        adS: [{ record: { entityType: 'agumon', firstName: 'ads' }, updatedAt: new Date(20) }],
        mir: [{ record: { entityType: 'agumon', firstName: 'i' }, updatedAt: new Date(16) }],

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

describe('selector', () => {
  describe('selector', () => {
    it('Should fall because only sf source', () => {
      selector(
        {
          sf: [{ record: { entityType: 'agumon', firstName: 'sf', personalNumber: '1621441' }, updatedAt: new Date() }],
          identifiers: {},
        },
        runType.RECOVERY
      );

      expect(warnStr.includes('sf')).toBeTruthy();
    });

    it("Should didn't fall when has mir source", () => {
      selector(
        {
          mir: [
            { record: { entityType: 'agumon', firstName: 'sf', personalNumber: '1621441' }, updatedAt: new Date() },
          ],
          aka: [{ record: { entityType: 'agumon', firstName: 'sf' }, updatedAt: new Date() }],
          identifiers: {},
        },
        runType.RECOVERY
      );

      expect(warnStr.includes('mir')).toBeFalsy;
    });

    it('Should fall because C without identityCard', () => {
      selector(
        {
          aka: [{ record: { firstName: 'sf', entityType: 'digimon' }, updatedAt: new Date() }],
          identifiers: { personalNumber: '1621441' },
        },
        runType.RECOVERY
      );

      expect(warnStr.includes('C without identityCard')).toBeTruthy();
    });

    it('Should fall because C without personalNumber', () => {
      selector(
        {
          aka: [{ record: { firstName: 'sf', entityType: 'agumon' }, updatedAt: new Date() }],
          identifiers: { identityCard: '1621441' },
        },
        runType.RECOVERY
      );

      expect(warnStr.includes('S without personal number')).toBeTruthy();
    });

    it('Should send only to entity', () => {
      selector(
        {
          aka: [{ record: { firstName: 'sf', entityType: 'digimon' }, updatedAt: new Date() }],
          identifiers: { identityCard: '1621441' },
        },
        runType.RECOVERY
      );

      expect(infoStr.includes('Entity queue')).toBeTruthy();
    });

    it('Should send also to rogd', () => {
      selector(
        {
          eightSocks: [
            { record: { firstName: 'sf', entityType: 'digimon', userID: 'ds' } as any, updatedAt: new Date() },
          ],
          identifiers: { identityCard: '1621441' },
        },
        runType.RECOVERY
      );

      expect(infoStr.includes('Rogd')).toBeTruthy();
    });
  });

  describe('only mir', () => {
    it('should', () => {
      expect(onlyMir({ m: [], a: 's', q: {} } as any)).toBe(1);
    });
    it('should', () => {
      expect(onlyMir({ m: [], a: 's', q: {}, as: [] } as any)).toBe(2);
    });
    it('should', () => {
      expect(onlyMir({ m: 23, a: 's', q: {}, as: {} } as any)).toBe(0);
    });
  });
});
