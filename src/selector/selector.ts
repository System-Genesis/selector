import { logInfo, logWarn as logWarn } from '../logger/logger';
import { mergedObj, mergedRecord } from '../types/mergedObjType';
import { sendToEntityQueue, sendToRogdQueue } from '../rabbit/rabbit';
import { record } from '../types/recordType';
import { isC, isS } from '../util/util';
import LOGS from '../logger/logs';

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

  /**
   * Didn't build entity from mergeObject with:
   *    only mir source
   *    or c without identityCard
   *    or s without personalNumber
   */
  if (mergeObj.mir && Object.keys(mergeObj).length <= 2) {
    return logWarn(`${LOGS.WARN.RGBE_NOT_SENDED} only mir source`, mergeObj.identifiers);
  } else if (isC(mergeObj)) {
    if (!mergeObj.identifiers.identityCard) {
      return logWarn(`${LOGS.WARN.RGBE_NOT_SENDED} C without identityCard`, mergeObj.identifiers);
    }
  } else if (isS(mergeObj) && !mergeObj.identifiers.personalNumber) {
    return logWarn(`${LOGS.WARN.RGBE_NOT_SENDED} S without personal number`, mergeObj.identifiers);
  }

  logInfo(`${LOGS.INFO.SEND_QUEUE} Entity queue`, mergeObj.identifiers);
  sendToEntityQueue(mergeObj);

  const record: record = findNewestRecord(mergeObj);

  if (record.userId) {
    logInfo(`${LOGS.INFO.SEND_QUEUE} Rogd queue`, {
      ...mergeObj.identifiers,
      source: record.source,
    });
    sendToRogdQueue(record);
  } else {
    logWarn(`${LOGS.WARN.RGB_NOT_SENDED}no userId`, {
      ...mergeObj.identifiers,
      source: record.source,
    });
  }
};

/**
 * Find the record that need to work with (send to rogd queue)
 *
 * @param mergeObj contains all records under source field
 * @returns the last update record
 */
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
