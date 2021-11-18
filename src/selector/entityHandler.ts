import { logInfo } from '../logger/logger';
import { mergedObj } from '../types/mergedType';
import { sendToEntityQueue } from '../rabbit/rabbit';
import { isC, isS, isValidEntity } from '../util/util';
import LOGS from '../logger/logs';

export const onlyMir = (mergedObj: mergedObj) => {
  return Object.keys(mergedObj).reduce((sum, curr) => (sum += Array.isArray(mergedObj[curr]) ? 1 : 0), 0) === 1;
};

/**
 * Check if possible to build entity and sent to queue if can
 * Throw warn error if not
 *
 * Didn't build entity from mergeObject with:
 *    only mir source
 *    or c without identityCard
 *    or s without personalNumber
 *
 * @param mergeObj all sources of entity
 */
export function entityHandler(mergeObj: mergedObj) {
  logInfo('Got mergeObj', mergeObj.identifiers);

  if (!isValidEntity(mergeObj)) {
    throw `${LOGS.WARN.RGBE_NOT_SENDED} missing required fields in entity`;
  } else if (mergeObj.mir && onlyMir(mergeObj)) {
    throw `${LOGS.WARN.RGBE_NOT_SENDED} only mir source`;
  } else if (isC(mergeObj)) {
    if (!mergeObj.identifiers.identityCard) {
      throw `${LOGS.WARN.RGBE_NOT_SENDED} C without identityCard`;
    }
  } else if (isS(mergeObj) && !mergeObj.identifiers.personalNumber) {
    throw `${LOGS.WARN.RGBE_NOT_SENDED} S without personal number`;
  }

  logInfo(`${LOGS.INFO.SEND_QUEUE} Entity queue`, mergeObj.identifiers);
  sendToEntityQueue(mergeObj);
}
