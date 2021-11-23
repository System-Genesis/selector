import { mergedObj } from '../types/mergedType';
import { sendToRogdQueue } from '../rabbit/rabbit';
import { record } from '../types/recordType';
import LOGS from '../logger/logs';
import logger from 'logger-genesis';

/**
 * Validate record and send to queue
 * @param record to validate
 * @param mergeObj for logs
 */
export async function recordHandler(record: record, mergeObj: mergedObj) {
  if (record.userID) {
    await sendToRogdQueue(record);
    logger.info(false, 'APP', `${LOGS.INFO.SEND_QUEUE}: ROGD`, `MargedObj from ${record.source} sended to ROGD queue`, {
      ids: mergeObj.identifiers,
      source: record.source,
    });
  } else {
    throw `${LOGS.WARN.RGB_NOT_SENDED} no userId, from ${record.source}`;
  }
}
