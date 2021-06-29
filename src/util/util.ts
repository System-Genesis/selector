import fieldsName from '../config/fieldsName';
import { mergedObj } from '../types/mergedObjType';

export function validC(mergeObj: mergedObj) {
  return !!(
    mergeObj.identifiers.identityCard &&
    JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.c)
  );
}

export function isC(mergeObj: mergedObj) {
  return !!JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.c);
}

export function isS(mergeObj: mergedObj) {
  return !!JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.s);
}

export function validS(mergeObj: mergedObj) {
  return !!(
    mergeObj.identifiers.personalNumber &&
    JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.s)
  );
}
