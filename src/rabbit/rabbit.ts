import menash, { ConsumerMessage } from 'menashmq';
import config from '../config/env.config';
import { logInfo, logError } from '../logger/logger';
import { createEntity } from '../service/buildEntity';
import { entity } from '../types/entityType';
import { mergedObj } from '../types/mergedObjType';

export const connectRabbit = async () => {
  await menash.connect(config.rabbit.uri, config.rabbit.retryOptions);

  await menash.declareQueue(config.rabbit.getData);
  await menash.declareQueue(config.rabbit.sendData);
  await menash.declareQueue(config.rabbit.logger);

  logInfo('Rabbit connected');

  await menash.queue(config.rabbit.getData).activateConsumer(
    async (msg: ConsumerMessage) => {
      try {
        const mergedObj = msg.getContent() as mergedObj;
        logInfo(`Got from queue => `, mergedObj);

        const entity = await createEntity(mergedObj);

        if (entity) {
          logInfo('Entity builded');

          await sendRecordToDiff(entity);
          logInfo('Send to dif queue');

          msg.ack();
        } else {
          throw 'Entity not builded';
        }
      } catch (error) {
        logError(error);

        // handle error reject or else ...
        msg.ack();
      }
    },
    { noAck: false }
  );
};

export const sendRecordToDiff = async (data: entity) => {
  try {
    await menash.send(config.rabbit.sendData, data);
  } catch (error) {
    logInfo(`${error}`.split('at C')[0]);
  }
};

export default { connectRabbit, sendRecordToDiff };
