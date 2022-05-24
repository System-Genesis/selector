import { mergedObj } from '../types/mergedType';
import { sendToEntityQueue } from '../rabbit/rabbit';
import { isC, isS, isValidEntity } from '../util/util';
import LOGS from '../logger/logs';
import logger from 'logger-genesis';

export const onlyMir = (mergedObj: mergedObj) => {
  return Object.keys(mergedObj).reduce((sum, curr) => (sum += Array.isArray(mergedObj[curr]) ? 1 : 0), 0) === 1;
};

/**
 * Check if possible to build entity and sent to queue if can
 * Throw warn error if not
 *
 * Didn't build entity from mergeObject with:
 *    only mir source (didn't throw)
 *    or c without identityCard
 *    or s without personalNumber
 *
 * @param mergeObj all sources of entity
 */
export async function entityHandler(mergeObj: mergedObj) {
  logger.info(false, 'APP', 'Got from entity queue', JSON.stringify(mergeObj), mergeObj);

  if (mergeObj.mir && onlyMir(mergeObj)) {
    return;
  } else if (!isValidEntity(mergeObj)) {
    throw `${LOGS.WARN.RGBE_NOT_SENDED} missing required fields in entity`;
  } else if (isC(mergeObj)) {
    if (!mergeObj.identifiers.identityCard) {
      throw `${LOGS.WARN.RGBE_NOT_SENDED} C without identityCard`;
    }
  } else if (isS(mergeObj) && !mergeObj.identifiers.personalNumber) {
    throw `${LOGS.WARN.RGBE_NOT_SENDED} S without personal number`;
  }

  await sendToEntityQueue(mergeObj);
  logger.info(false, 'APP', `${LOGS.INFO.SEND_QUEUE}: Entity`, 'Send to Entity queue', mergeObj.identifiers);
}
