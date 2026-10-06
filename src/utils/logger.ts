// @ts-nocheck
import pino from 'pino';
import { env } from '../config/env.js';

const isDev = env.NODE_ENV === 'development';

const logger = pino({
  level: env.LOG_LEVEL,
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: {
    paths: ['password', 'token', 'secret', 'SESSION_SECRET', 'CSRF_SECRET', 'authorization', 'cookie'],
    censor: '[REDACTED]',
  },
  ...(isDev && parseInt(process.versions.node.split('.')[0], 10) < 24
    ? {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            ignore: 'pid,hostname',
            translateTime: 'SYS:standard',
          },
        },
      }
    : {}),
});

export const createRequestLogger = (requestId: string) => {
  return logger.child({ requestId });
};

export default logger;
