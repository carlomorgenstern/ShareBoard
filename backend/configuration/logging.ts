import Koa from 'koa';
import * as winston from 'winston';

import { processEnvironment } from './environment';

export const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format(info => {
          if (info.error instanceof Error) info.message += '\n' + String(info.error.stack);

          return info;
        })(),
        winston.format.cli(),
      ),
      handleExceptions: true,
      level: processEnvironment.CONSOLE_LOG_LEVEL,
    }),
    new winston.transports.File({
      filename: 'application.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format(info => {
          if (info.error instanceof Error) info.error = info.error.stack;

          return info;
        })(),
        winston.format.json(),
      ),
      handleExceptions: true,
      level: processEnvironment.FILE_LOG_LEVEL,
      maxFiles: 20,
      maxsize: 1048576, // bytes = 1 MB
      tailable: true,
    }),
  ],
});

export function configureLogging(app: Koa): void {
  app.use(async (ctx, next) => {
    const startMs = Date.now();
    await next();
    const responseTimeMs = Date.now() - startMs;
    logger.info(`${ctx.status} ${ctx.method} ${ctx.url} - ${responseTimeMs}ms\n${JSON.stringify(ctx.body)}`);
  });
}
