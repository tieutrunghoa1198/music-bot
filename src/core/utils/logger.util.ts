import winston from 'winston';

const { combine, timestamp, printf } = winston.format;

export const logger = winston.createLogger({
  level: 'debug',
  format: combine(
    timestamp(),
    printf(
      (info) =>
        `${info.timestamp} | ${info.level.toUpperCase()} | ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'app.log' }),
  ],
});
