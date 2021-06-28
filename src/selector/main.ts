import { logWorn as logWorn } from '../logger/logger';
import { mergedObj, mergedRecord } from '../types/mergedObjType';
import { sentToEntityQueue, sendToRogdQueue } from '../rabbit/rabbit';
import { record } from '../types/recordType';
import { validC, validS } from '../util/util';

export const selector = (mergeObj: mergedObj): void => {
  const errorMsg =
    "didn't build entity from mergeObj because entityType didn't match the identifier";
  let sentRecordWithIdentifiers = true;

  // Didn't build entity from mergeObject with:
  //    only mir source
  //    or s without personalNumber
  //    or c without identityCard
  if (mergeObj.mir && Object.keys(mergeObj).length <= 2) {
    logWorn(`didn't build entity from mergeObj with only mir source`, mergeObj.identifiers);
    sentRecordWithIdentifiers = false;
  } else if (!validS(mergeObj) && !validC(mergeObj)) {
    logWorn(
      `${errorMsg} personalNumber:${mergeObj.identifiers.personalNumber},personalNumber:${mergeObj.identifiers.identityCard}`,
      mergeObj.identifiers
    );
    sentRecordWithIdentifiers = false;
  } else {
    sentToEntityQueue(mergeObj);
  }

  const record: record = findNewestRecord(mergeObj);

  // If not build entity delete entity identifiers (build DI without connect to entity)
  if (!sentRecordWithIdentifiers) {
    delete record.personalNumber;
    delete record.identityCard;
    delete record.goalUserId;
  }

  sendToRogdQueue(record);
};

function findNewestRecord(mergeObj: mergedObj) {
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
