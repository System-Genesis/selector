import { logWarn } from '../logger/logger';
import { mergedObj, mergedRecord } from '../types/mergedType';
import { record } from '../types/recordType';
import { recordHandler } from './recordHandler';
import { entityHandler } from './entityHandler';
import { findNewestRecord } from '../util/util';
import { runType } from '../types/runType';

/**
 * Check if object can send to build entity
 * Find updated record
 * If not send to build entity: updated record to not connect DI to Entity
 * Send record to build ROGD as is
 *
 * @param mergeObj objet from merger service
 */
export const selector = (mergeObj: mergedObj, type: runType = runType.DAILY) => {
  try {
    entityHandler(mergeObj);

    if (type === runType.RECOVERY) recovery(mergeObj);
    else if (type === runType.DAILY) daily(mergeObj);
  } catch (error) {
    logWarn(error, mergeObj.identifiers);
  }
};

function daily(mergeObj: mergedObj) {
  const record: record = findNewestRecord(mergeObj);

  recordHandler(record, mergeObj);
}

/**
 * Run on all records and send to recordHandler()
 * @param mergeObj contains all records under source field
 */
export function recovery(mergeObj: mergedObj) {
  Object.keys(mergeObj).forEach((source) => {
    if (source !== 'identifiers') {
      const sourceRecords: mergedRecord[] = mergeObj[source];
      sourceRecords.forEach(({ record }: mergedRecord) => recordHandler(record, mergeObj));
    }
  });
}
