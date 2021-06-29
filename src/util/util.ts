import fieldsName from '../config/fieldsName';
import { mergedObj } from '../types/mergedObjType';

export function validC(mergeObj: mergedObj) {
  return !!(
    mergeObj.identifiers.identityCard &&
    JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.c)
  );
}

export function validS(mergeObj: mergedObj) {
  return !!(
    mergeObj.identifiers.personalNumber &&
    JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.s)
  );
}
