import { logInfo } from '../logger/logger';
import { mergedObj } from '../types/mergedType';
import { sendToRogdQueue } from '../rabbit/rabbit';
import { record } from '../types/recordType';
import LOGS from '../logger/logs';

/**
 * Validate record and send to queue
 * @param record to validate
 * @param mergeObj for logs
 */
export function recordHandler(record: record, mergeObj: mergedObj) {
  if (record.userId) {
    logInfo(`${LOGS.INFO.SEND_QUEUE} Rogd queue`, {
      ...mergeObj.identifiers,
      source: record.source,
    });
    sendToRogdQueue(record);
  } else {
    throw `${LOGS.WARN.RGB_NOT_SENDED}no userId, from ${record.source}`;
  }
}
