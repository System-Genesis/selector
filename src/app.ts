import { initializeLogger } from './logger/logger';
import connectRabbit from './rabbit/rabbit';

(async () => {
  await initializeLogger();
  await connectRabbit();
})();
