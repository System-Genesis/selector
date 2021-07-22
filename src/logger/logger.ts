import { menash } from 'menashmq';
import winston, { config, format } from 'winston';
import configEnv from '../config/env.config';

const logger = winston.createLogger({
  levels: config.npm.levels,

  format: format.combine(format.colorize(), format.splat(), format.simple()),
  transports: [new winston.transports.Console()],
});

export const logInfo = (msg: string, any?: any) => {
  menash.send(configEnv.rabbit.logger, {
    level: 'info',
    message: `${msg}. ${any ? JSON.stringify(any) : ''}`,
    system: 'traking',
    service: 'build entity',
    extraFields: any,
  });

  if (any) logger.info(`${msg} ${JSON.stringify(any)}`);
  else logger.info(msg);
};

export const logWarn = (msg: string, any?: any) => {
  menash.send(configEnv.rabbit.logger, {
    level: 'warning',
    message: `${msg}. ${any ? JSON.stringify(any) : ''}`,
    system: 'traking',
    service: 'build entity',
    extraFields: any,
  });
  logger.warn(`${msg} ${!any ? '' : JSON.stringify(any)}`);
};

export const logError = (msg: string, any?: any) => {
  menash.send(configEnv.rabbit.logger, {
    level: 'error',
    message: `${msg}. ${any ? JSON.stringify(any) : ''}`,
    system: 'traking',
    service: 'build entity',
    extraFields: any,
  });
  logger.error(`${msg} ${!any ? '' : JSON.stringify(any)}`);
};
