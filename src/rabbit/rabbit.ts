import logger from 'logger-genesis';
import { menash, ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { selector } from '../selector/selector';
import { mergedObj } from '../types/mergedType';
import { record } from '../types/recordType';
import { runType } from '../types/runType';

export const connectRabbit = async () => {
  console.log('Try to connect rabbit');
  try {
    await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

    await menash.declareQueue(config.rabbit.getDataSelector);
    await menash.declareQueue(config.rabbit.getDataRecovery);
    await menash.declareQueue(config.rabbit.sendDataEntity);
    await menash.declareQueue(config.rabbit.sendDataRogdNormal);
    await menash.declareQueue(config.rabbit.sendDataRogdMir);

    console.log('Rabbit connected');
  } catch (error: any) {
    logger.error(false, 'SYSTEM', 'Unknown Error, on Connect Rabbit', error.message);
  }
};

export const sendToEntityQueue = async (entityToBuild: mergedObj) => {
  await menash.send(config.rabbit.sendDataEntity, entityToBuild);
};

export const sendToRogdQueueNormal = async (record: record) => {
  await menash.send(config.rabbit.sendDataRogdNormal, record);
};

export const sendToRogdQueueMir = async (record: record) => {
  await menash.send(config.rabbit.sendDataRogdMir, record);
};

export default connectRabbit;

export async function consumeQueues() {
  await menash.queue(config.rabbit.getDataSelector).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const mergedObj = msg.getContent() as mergedObj;

        await selector(mergedObj, runType.DAILY);

        msg.ack();
      } catch (error: any) {
        const erMsg = JSON.stringify(error.message);

        logger.error(true, 'SYSTEM', 'Unknown Error, on SELECTOR queue', erMsg);

        msg.ack();
      }
    },
    { noAck: false }
  );

  await menash.queue(config.rabbit.getDataRecovery).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const mergedObj = msg.getContent() as mergedObj;

        cleanObj(mergedObj);

        await selector(mergedObj, runType.RECOVERY);

        msg.ack();
      } catch (error: any) {
        const erMsg = JSON.stringify(error.message);
        logger.error(true, 'SYSTEM', 'Unknown Error RECOVERY queue', erMsg);

        // handle error reject or else ...
        msg.ack();
      }
    },
    { noAck: false }
  );
}

function cleanObj(obj: object) {
  Object.keys(obj).forEach((key) => {
    if (obj[key] == null || obj[key] == undefined) delete obj[key];
  });
}
