import { menash } from 'menashmq';
import path from 'path';
// import os from 'os';
import winston, { config, format } from 'winston';
import configEnv from '../config/env.config';

const date = () => new Date(Date.now()).toLocaleDateString();

const logger = winston.createLogger({
  levels: config.npm.levels,

  format: format.combine(
    format.colorize(),
    // format.timestamp({
    //   format: 'YYYY-MM-DD HH:mm:ss',
    // }),
    format.splat(),
    format.simple(),
    // format((info) => {
    //   info.service = 'build entity';
    //   info.hostname = os.hostname();
    //   return info;
    // })(),
    format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: path.join(__dirname, `../../log/${date()}-logger.log`),
      maxsize: 50000,
    }),
  ],
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

export const logWorn = (msg: string, any?: any) => {
  menash.send(configEnv.rabbit.logger, {
    level: 'warning',
    message: `${msg}. ${any ? JSON.stringify(any) : ''}`,
    system: 'traking',
    service: 'build entity',
    extraFields: any,
  });
  logger.error(`${msg} ${!any ? '' : JSON.stringify(any)}`);
};
