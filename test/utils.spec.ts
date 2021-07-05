import { validC, validS } from '../src/util/util';

/**
 * S + PN
 * C + IC
 * C + PN
 * S + IC
 * S&C + IC
 * S&C + PN
 * S&C
 * C
 * S
 */
describe('utils', () => {
  it('Should return true. S with personalNumber', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a', personalNumber: '1621441' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

      identifiers: {
        personalNumber: '1621441',
        identityCard: 'string',
        goalUser: 'string',
      },
    };

    const res = validS(mergeObj);

    expect(res).toBeTruthy;
  });

  it('Should return true. C with identityCard', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a', identityCard: '12345678' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'digimon' }, updatedAt: new Date(16) }],

      identifiers: {
        identityCard: '12345678',
      },
    };

    const res = validC(mergeObj);

    expect(res).toBeTruthy;
  });

  it('Should return false. C with personalNumber', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a', personalNumber: '12345678' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'digimon' }, updatedAt: new Date(16) }],

      identifiers: {
        personalNumber: '12345678',
      },
    };

    const res = validC(mergeObj);

    expect(res).toBeFalsy;
  });

  it('Should return false. S with identityCard', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a', identityCard: '12345678' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

      identifiers: {
        identityCard: '12345678',
      },
    };

    const res = validC(mergeObj);

    expect(res).toBeFalsy;
  });

  it('Should return true. S&C with identityCard', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a', identityCard: '12345678' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f', entityType: 'digimon' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

      identifiers: {
        identityCard: '12345678',
      },
    };

    const res = validC(mergeObj) || validS(mergeObj);

    expect(res).toBeTruthy;
  });

  it('Should return true. S&C with personalNumber', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a', personalNumber: '12345678' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f', entityType: 'digimon' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

      identifiers: {
        personalNumber: '12345678',
      },
    };

    const res = validC(mergeObj) || validS(mergeObj);

    expect(res).toBeTruthy;
  });

  it('Should return false. S&C without personalNumber or identityCard', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f', entityType: 'digimon' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

      identifiers: {},
    };

    const res = validC(mergeObj) || validS(mergeObj);

    expect(res).toBeFalsy;
  });

  it('Should return false. C without identityCard', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f', entityType: 'digimon' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

      identifiers: {},
    };

    const res = validC(mergeObj) || validS(mergeObj);

    expect(res).toBeFalsy;
  });

  it('Should return false. S without personalNumber', () => {
    let mergeObj = {
      aka: [{ record: { firstName: 'a' }, updatedAt: new Date(10) }],
      eightSocks: [{ record: { firstName: 'b' }, updatedAt: new Date(11) }],
      sf: [{ record: { firstName: 'd' }, updatedAt: new Date(12) }],
      city: [{ record: { firstName: 'c' }, updatedAt: new Date(13) }],
      adNn: [{ record: { firstName: 'e' }, updatedAt: new Date(14) }],
      adS: [{ record: { firstName: 'f', entityType: 'digimon' }, updatedAt: new Date(15) }],
      mir: [{ record: { firstName: 'i', entityType: 'agumon' }, updatedAt: new Date(16) }],

      identifiers: {},
    };

    const res = validC(mergeObj) || validS(mergeObj);

    expect(res).toBeFalsy;
  });
});
