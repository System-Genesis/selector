import { logInfo, logWarn as logWarn } from '../logger/logger';
import { mergedObj, mergedRecord } from '../types/mergedObjType';
import { sendToEntityQueue, sendToRogdQueue } from '../rabbit/rabbit';
import { record } from '../types/recordType';
import { isC, isS } from '../util/util';

/**
 * Check if object can send to build entity
 * Find updated record
 * If not send to build entity: updated record to not connect DI to Entity
 * Send record to build ROGD as is
 *
 * @param mergeObj objet from merger service
 */
export const selector = (mergeObj: mergedObj): void => {
  logInfo('Got mergeObj', mergeObj.identifiers);
  let canBuildEntity = true;

  /**
   * Didn't build entity from mergeObject with:
   *    only mir source
   *    or c without identityCard
   *    or s without personalNumber
   */
  if (mergeObj.mir && Object.keys(mergeObj).length <= 2) {
    logWarn(`didn't build entity from mergeObj with only mir source`, mergeObj.identifiers);
    canBuildEntity = false;
  } else if (isC(mergeObj)) {
    if (!mergeObj.identifiers.identityCard) {
      logWarn(
        "Didn't build entity from mergeObj because C without identityCard",
        mergeObj.identifiers
      );
      canBuildEntity = false;
    }
  } else if (isS(mergeObj) && !mergeObj.identifiers.personalNumber) {
    logWarn(
      "Didn't build entity from mergeObj because S without personal number",
      mergeObj.identifiers
    );
    canBuildEntity = false;
  }

  const record: record = findNewestRecord(mergeObj);

  if (canBuildEntity) {
    logInfo('send To build Entity queue', mergeObj.identifiers);
    sendToEntityQueue(mergeObj);

    if (record.userId) {
      logInfo('Send To build Rogd queue', {
        identifiers: mergeObj.identifiers,
        source: record.source,
      });
      sendToRogdQueue(record);
    } else {
      logWarn("Didn't sent to  build ROGD because no userId", mergeObj.identifiers);
    }
  } else {
    logWarn("Didn't sent to  build ROGD because entity not builded", mergeObj.identifiers);
  }
};

export function findNewestRecord(mergeObj: mergedObj) {
  let newestRecord: mergedRecord = { record: {}, updatedAt: new Date(0) };

  Object.keys(mergeObj).forEach((source) => {
    if (source !== 'identifiers')
      mergeObj[source].forEach((rec: mergedRecord) => {
        if (rec.updatedAt > newestRecord.updatedAt) {
          newestRecord = rec;
        }
      });
  });

  return newestRecord.record;
}
