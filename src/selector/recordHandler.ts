import { mergedObj, identifiers } from '../types/mergedType';
import { sendToRogdQueueMir, sendToRogdQueueNormal } from '../rabbit/rabbit';
import { record } from '../types/recordType';
import LOGS from '../logger/logs';
import logger from 'logger-genesis';
import { onlyMir } from './entityHandler';

/**
 * Validate record and send to queue
 * @param record to validate
 * @param mergeObj for logs
 */
export async function recordHandler(record: record, mergeObj: mergedObj) {
  if (record.userID) {
    if (mergeObj.mir && onlyMir(mergeObj)) {
      await sendToRogdQueueMir(record);
      logInfo(record.source!, mergeObj.identifiers, 'ROGD_MIR');
    } else {
      await sendToRogdQueueNormal(record);
      logInfo(record.source!, mergeObj.identifiers, 'ROGD_NORMAL');
    }
  } else {
    throw `${LOGS.WARN.RGB_NOT_SENDED} no userId, from ${record.source}`;
  }
}

function logInfo(source: string, identifiers: identifiers, queueName: string) {
  logger.info(false, 'APP', `${LOGS.INFO.SEND_QUEUE}: ${queueName}`, `MargedObj from ${source} sended to ROGD queue`, {
    ids: identifiers,
    source: source,
  });
}
