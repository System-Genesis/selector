import { logWorn as logWorn } from '../logger/logger';
import { mergedObj, mergedRecord } from '../types/mergedObjType';
import { entityQueue, rogdQueue } from '../rabbit/rabbit';
import fieldsName from '../config/fieldsName';
import { record } from '../types/recordType';
import { unValidC, unValidS } from '../util/util';

export const selector = (mergeObj: mergedObj): void => {
  const errorMsg =
    "didn't build entity from mergeObj because entityType didn't match the identifier";
  let sentRecordWithIdentifiers = true;

  if (mergeObj.mir && Object.keys(mergeObj).length <= 2) {
    logWorn(`didn't build entity from mergeObj with only mir source`, mergeObj.identifiers);
    sentRecordWithIdentifiers = false;
  } else if (unValidS(mergeObj)) {
    sentRecordWithIdentifiers = false;
    logWorn(
      `${errorMsg} entityType: ${fieldsName.entityType.s}, personalNumber:${mergeObj.identifiers.personalNumber}`,
      mergeObj.identifiers
    );
  } else if (unValidC(mergeObj)) {
    sentRecordWithIdentifiers = false;
    logWorn(
      `${errorMsg} entityType: ${fieldsName.entityType.c}, personalNumber:${mergeObj.identifiers.identityCard}`,
      mergeObj.identifiers
    );
  } else {
    entityQueue(mergeObj);
  }

  const record: record = findNewestRecord(mergeObj);

  if (!sentRecordWithIdentifiers) {
    delete record.personalNumber;
    delete record.identityCard;
    delete record.goalUserId;
  }

  rogdQueue(record);
};

function findNewestRecord(mergeObj: mergedObj) {
  let mergedRecord: mergedRecord = { record: {}, updatedAt: new Date(0) };

  Object.keys(mergeObj).forEach((source) => {
    if (source !== 'identifiers')
      mergeObj[source].forEach((rec: mergedRecord) => {
        if (rec.updatedAt > mergedRecord.updatedAt) {
          mergedRecord = rec;
        }
      });
  });

  return mergedRecord.record;
}
