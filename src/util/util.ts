import fieldsName from '../config/fieldsName';
import { mergedObj } from '../types/mergedObjType';

export function unValidC(mergeObj: mergedObj) {
  return !(
    /identityCard":\d/.test(JSON.stringify(mergeObj)) &&
    new RegExp(`(?=*identityCard":${fieldsName.entityType.s})(?=*personalNumber":\\d)`) &&
    JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.c)
  );
}

export function unValidS(mergeObj: mergedObj) {
  return !(
    /personalNumber":\d/.test(JSON.stringify(mergeObj)) &&
    JSON.stringify(mergeObj).includes('entityType":"' + fieldsName.entityType.s)
  );
}
