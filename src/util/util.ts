import { mergedObj, mergedRecord } from '../types/mergedType';
import fieldsName from '../config/fieldsName';
import env from '../config/env.config';

export function validC(mergeObj: mergedObj) {
  return (
    mergeObj.identifiers.identityCard &&
    JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.c)
  );
}

export function isC(mergeObj: mergedObj) {
  return JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.c);
}

export function isS(mergeObj: mergedObj) {
  return JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.s);
}

export function validS(mergeObj: mergedObj) {
  return (
    mergeObj.identifiers.personalNumber &&
    JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.s)
  );
}

/**
 * Find the record that need to work with (send to rogd queue)
 *
 * @param mergeObj contains all records under source field
 * @returns the last update record
 */
export function findNewestRecord(mergeObj: mergedObj) {
  let newestRecord: mergedRecord = { record: {}, updatedAt: new Date(0) };

  Object.keys(mergeObj).forEach((source) => {
    if (source !== 'identifiers' && source !== '_id' && Array.isArray(mergeObj[source]))
      mergeObj[source].forEach((rec: mergedRecord) => {
        if (new Date(rec.updatedAt) > new Date(newestRecord.updatedAt)) {
          newestRecord = rec;
        }
      });
  });

  return newestRecord.record;
}

export function isValidEntity(mergeObj: mergedObj) {
  const mergeString = JSON.stringify(mergeObj);
  return env.requiredFields.reduce((bool, field) => mergeString.includes(field) && bool, true)
}
