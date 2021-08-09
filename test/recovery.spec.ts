import { selector } from '../src/selector/selector';
import { runType } from '../src/types/runType';

jest.mock('../src/logger/logger', () => ({
  logInfo: () => {},
  logWarn: () => {},
}));

jest.mock('../src/rabbit/rabbit', () => {
  return {
    default: jest.fn(),
    sendToEntityQueue: () => {},
    sendToRogdQueue: () => {},
  };
});

let recordCount = 0;

jest.mock('../src/selector/recordHandler', () => ({
  recordHandler: () => recordCount++,
}));

describe('recovery', () => {
  beforeEach(() => {
    recordCount = 0;
  });

  it('Should send all record', () => {
    selector(
      {
        mir: [
          { record: { personalNumber: '1621441' }, updatedAt: new Date() },
          { record: { entityType: 'agumon' }, updatedAt: new Date() },
        ],
        aka: [
          { record: { personalNumber: '1621441' }, updatedAt: new Date() },
          { record: { entityType: 'agumon' }, updatedAt: new Date() },
        ],
        identifiers: { personalNumber: '1621441' },
      },
      runType.RECOVERY
    );

    expect(recordCount).toEqual(4);
  });

  it('Should not send record(entity not build)', () => {
    selector(
      {
        mir: [{ record: { personalNumber: '1621441' }, updatedAt: new Date() }],
        aka: [{ record: { entityType: 'digimon' }, updatedAt: new Date() }],
        identifiers: { personalNumber: '1621441' },
      },
      runType.RECOVERY
    );

    expect(recordCount).toEqual(0);
  });

  it('Should send one record (DAILY)', () => {
    selector(
      {
        mir: [
          { record: { personalNumber: '1621441' }, updatedAt: new Date() },
          { record: { entityType: 'agumon' }, updatedAt: new Date() },
        ],
        aka: [
          { record: { personalNumber: '1621441' }, updatedAt: new Date() },
          { record: { entityType: 'agumon' }, updatedAt: new Date() },
        ],
        identifiers: { personalNumber: '1621441' },
      },
      runType.DAILY
    );

    expect(recordCount).toEqual(1);
  });
});
