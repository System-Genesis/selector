import { menash, ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { selector } from '../selector/selector';
import { logError, logInfo } from '../logger/logger';
import { mergedObj } from '../types/mergedType';
import { record } from '../types/recordType';
import { runType } from '../types/runType';

export const connectRabbit = async () => {
  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  await menash.declareQueue(config.rabbit.getDataSelector);
  await menash.declareQueue(config.rabbit.getDataRecovery);
  await menash.declareQueue(config.rabbit.sendDataEntity);
  await menash.declareQueue(config.rabbit.sendDataRogd);
  await menash.declareQueue(config.rabbit.logger);

  logInfo('Rabbit connected');

  await menash.queue(config.rabbit.getDataSelector).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const mergedObj = msg.getContent() as mergedObj;

        selector(mergedObj, runType.DAILY);

        msg.ack();
      } catch (error) {
        logError(error);

        // handle error reject or else ...
        msg.ack();
      }
    },
    { noAck: false }
  );

  await menash.queue(config.rabbit.getDataRecovery).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const mergedObj = msg.getContent() as mergedObj;

        selector(mergedObj, runType.RECOVERY);

        msg.ack();
      } catch (error) {
        logError(error);

        // handle error reject or else ...
        msg.ack();
      }
    },
    { noAck: false }
  );
};

export const sendToEntityQueue = async (entityToBuild: mergedObj) => {
  await menash.send(config.rabbit.sendDataEntity, entityToBuild);
};

export const sendToRogdQueue = async (record: record) => {
  await menash.send(config.rabbit.sendDataRogd, record);
};

export default connectRabbit;
