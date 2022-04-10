import initializeHttp from './http/app';
import { initializeLogger } from './logger/logger';
import connectRabbit, { consumeQueues } from './rabbit/rabbit';

(async () => {
  initializeHttp();
  await connectRabbit();
  await initializeLogger();
  await consumeQueues();
})();
