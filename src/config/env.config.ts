import './dotenv';

import * as env from 'env-var';

export default {
  rabbit: {
    uri: env.get('MATCH_TO_KART_RABBIT_URI').required().asString(),
    sendDataEntity: env.get('SEND_DATA_ENTITY').required().asString(),
    sendDataRogd: env.get('SEND_DATA_ROGD').required().asString(),
    getData: env.get('GET_DATA').required().asString(),
    logger: env.get('LOGGER').required().asString(),
    retryOptions: {
      minTimeout: env.get('RABBIT_RETRY_MIN_TIMEOUT').default(1000).asIntPositive(),
      retries: env.get('RABBIT_RETRY_RETRIES').default(2).asIntPositive(),
      factor: env.get('RABBIT_RETRY_FACTOR').default(1.8).asFloatPositive(),
    },
  },
};
