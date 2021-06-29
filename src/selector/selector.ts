import { logInfo, logWarn as logWarn } from '../logger/logger';
import { mergedObj, mergedRecord } from '../types/mergedObjType';
import { sendToEntityQueue, sendToRogdQueue } from '../rabbit/rabbit';
import { record } from '../types/recordType';
import { validC, validS } from '../util/util';

export const selector = (mergeObj: mergedObj): void => {
  logInfo('Got mergeObj', mergeObj.identifiers);
  let canBuildEntity = true;

  // Didn't build entity from mergeObject with:
  //    only mir source
  //    or s without personalNumber
  //    or c without identityCard
  if (mergeObj.mir && Object.keys(mergeObj).length <= 2) {
    logWarn(`didn't build entity from mergeObj with only mir source`, mergeObj.identifiers);
    canBuildEntity = false;
  } else if (!validC(mergeObj) && !validS(mergeObj)) {
    logWarn(
      "didn't build entity from mergeObj because entityType didn't match the identifier",
      mergeObj.identifiers
    );
    canBuildEntity = false;
  }

  const record: record = findNewestRecord(mergeObj);

  if (canBuildEntity) {
    logInfo('send To build Entity queue', mergeObj.identifiers);
    sendToEntityQueue(mergeObj);
  } else {
    // If not build entity delete entity identifiers (build DI without connect to entity)
    delete record.personalNumber;
    delete record.identityCard;
    delete record.goalUserId;
  }

  if (record.userId) {
    logInfo('Send To build Rogd queue', {
      identifiers: mergeObj.identifiers,
      source: record.source,
    });
    sendToRogdQueue(record);
  } else {
    logWarn("Didn't sent to  build ROGD because no userId", mergeObj.identifiers);
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
