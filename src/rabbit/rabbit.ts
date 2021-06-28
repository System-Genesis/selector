import { menash, ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { selector } from '../selector/main';
import { logInfo, logError } from '../logger/logger';
import { mergedObj } from '../types/mergedObjType';
import { record } from '../types/recordType';

export const connectRabbit = async () => {
  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  await menash.declareQueue(config.rabbit.getData);
  await menash.declareQueue(config.rabbit.sendDataEntity);
  await menash.declareQueue(config.rabbit.sendDataRogd);
  await menash.declareQueue(config.rabbit.logger);

  logInfo('Rabbit connected');

  await menash.queue(config.rabbit.getData).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const mergedObj = msg.getContent() as mergedObj;
        logInfo(`Got from queue => `, mergedObj);

        await selector(mergedObj);

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

export const entityQueue = async (entityToBuild: mergedObj) => {
  await menash.send(config.rabbit.sendDataEntity, entityToBuild);
};

export const rogdQueue = async (record: record) => {
  await menash.send(config.rabbit.sendDataEntity, record);
};

export default { connectRabbit };
