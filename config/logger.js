const { createLogger, format, transports } = require('winston')
const { combine, timestamp, errors } = format

const myFormat = format.printf(info => {
  const log = `${info.timestamp} ${info.level}: ${info.message}`

  return info.stack ? `${log}\n${info.stack}` : log
})

const logger = createLogger({
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    errors({ stack: true }),
    myFormat
  ),
  transports:
    process.env.NODE_ENV === 'production'
      ? [
          new transports.File({ filename: 'error.log', level: 'error' }),
          new transports.File({ filename: 'combined.log' }),
        ]
      : [new transports.Console()],

  exceptionHandlers:
    process.env.NODE_ENV === 'production'
      ? [new transports.File({ filename: 'exceptions.log' })]
      : null,
})

module.exports = logger
