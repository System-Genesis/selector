import './dotenv';

import * as env from 'env-var';

export default {
  requiredFields: env.get('ENTITY_REQUIRED_FIELDS').required().asArray(),
  rabbit: {
    uri: env.get('MATCH_TO_KART_RABBIT_URI').required().asString(),
    sendDataEntity: env.get('SEND_DATA_ENTITY').required().asString(),
    sendDataRogd: env.get('SEND_DATA_ROGD').required().asString(),
    getDataSelector: env.get('GET_DATA_SELECTOR').required().asString(),
    getDataRecovery: env.get('GET_DATA_RECOVERY').required().asString(),
    logger: env.get('LOGGER').required().asString(),
    retryOptions: {
      minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
      retries: env.get('RABBIT_RETRY_RETRIES').default(10).asIntPositive(),
      factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
    },
  },
};
