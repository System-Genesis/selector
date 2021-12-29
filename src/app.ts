import { initializeLogger } from './logger/logger';
import connectRabbit, { consumeQueues } from './rabbit/rabbit';

(async () => {
  await connectRabbit();
  await initializeLogger();
  await consumeQueues();
})();
