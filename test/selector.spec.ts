import { assert } from 'chai';
import { findNewestRecord } from '../src/selector/selector';
describe('selector', () => {
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

      assert.equal(res.firstName, 'sf');
    });
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

    assert.equal(res.firstName, 'ads');
  });
});
