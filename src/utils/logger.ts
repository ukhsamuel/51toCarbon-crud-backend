import { config, createLogger, format, transports } from 'winston';

const { combine, printf } = format;

const formatOptions = {
  format: combine(
    process.env.NODE_ENV !== 'production' ? format.simple() : format.json(),

    printf((info) => {
      const today = new Date();
      const timestamp = `${
        today.toISOString().split('T')[0]
      } ${today.toLocaleTimeString()}`;
      return `${timestamp} ${info.level}: ${info.message}`;
    }),
  ),
};

const options = {
  error: {
    level: 'error',
    filename: `${process.cwd()}/logs/error.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  combined: {
    level: 'info',
    filename: `${process.cwd()}/logs/app.log`,
    handleExceptions: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
  },
  console: {
    level: 'debug',
    levels: config.npm.levels,
    handleExceptions: true,
    json: false,
    colorize: true,
  },
};

const logger = createLogger({
  ...formatOptions,
  transports: [
    new transports.File(options.error),
    new transports.File(options.combined),
  ],
});

export default logger;
