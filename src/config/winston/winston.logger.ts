import * as winston from 'winston';

const TransportOptions = {
  maxsize: 20 * 1024 * 1024, // 20MB
  maxFiles: 14,
  tailable: true,
  format: winston.format.combine(winston.format.json()),
};

const winstonLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss.SSS',
    }),
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/combined.log',
      ...TransportOptions,
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      ...TransportOptions,
    }),
    new winston.transports.File({
      filename: 'logs/exceptions.log',
      ...TransportOptions,
      handleExceptions: true,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.printf(
          (info) =>
            `${info.level}: ${info.message}${
              info.stack ? `\n${info.stack}` : ''
            }`,
        ),
      ),
      handleExceptions: true,
      level: 'error',
    }),
  ],
});

export default winstonLogger;
