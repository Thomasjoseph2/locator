import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize, align } = format;

const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), align(), logFormat)
    }),
    // You can add more transports here, e.g., for file logging in production
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' })
  ],
  exceptionHandlers: [
    new transports.Console(),
    // new transports.File({ filename: 'exceptions.log' })
  ],
  rejectionHandlers: [
    new transports.Console(),
    // new transports.File({ filename: 'rejections.log' })
  ]
});

export default logger;