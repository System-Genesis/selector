import { mergedObj, mergedRecord } from '../types/mergedType';
import { record } from '../types/recordType';
import { recordHandler } from './recordHandler';
import { entityHandler } from './entityHandler';
import { findNewestRecord } from '../util/util';
import { runType } from '../types/runType';
import logger from 'logger-genesis';

/**
 * Check if object can send to build entity
 * Find updated record
 * If not send to build entity: updated record to not connect DI to Entity
 * Send record to build ROGD as is
 *
 * @param mergeObj objet from merger service
 */
export const selector = async (mergeObj: mergedObj, type: runType = runType.DAILY) => {
  try {
    await entityHandler(mergeObj);

    if (type === runType.RECOVERY) recovery(mergeObj);
    else if (type === runType.DAILY) daily(mergeObj);
  } catch (error) {
    logger.warn(true, 'APP', 'MargeObj not pass', `${error}`, mergeObj.identifiers);
  }
};

async function daily(mergeObj: mergedObj) {
  const record: record = findNewestRecord(mergeObj);

  try {
    await recordHandler(record, mergeObj);
  } catch (error) {
    logger.warn(true, 'APP', 'MargeObj not pass (daily)', `${error}`, mergeObj.identifiers);
  }
}

/**
 * Run on all records and send to recordHandler()
 * @param mergeObj contains all records under source field
 */
export function recovery(mergeObj: mergedObj) {
  Object.keys(mergeObj).forEach((source) => {
    if (Array.isArray(mergeObj[source])) {
      const sourceRecords: mergedRecord[] = mergeObj[source];
      sourceRecords.forEach(async ({ record }: mergedRecord) => {
        try {
          await recordHandler(record, mergeObj);
        } catch (error) {
          logger.warn(true, 'APP', 'MargeObj not pass', `${error}`, mergeObj.identifiers);
        }
      });
    }
  });
}
