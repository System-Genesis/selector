import { logInfo } from '../logger/logger';
import { mergedObj } from '../types/mergedType';
import { sendToEntityQueue } from '../rabbit/rabbit';
import { isC, isS } from '../util/util';
import LOGS from '../logger/logs';

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

  if (mergeObj.mir && Object.keys(mergeObj).length <= 2) {
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
