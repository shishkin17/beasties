import path from 'node:path'
import chalk from 'chalk'

const LOG_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'silent']

export const defaultLogger = {
  trace(msg) {
    // eslint-disable-next-line no-console
    console.trace(msg)
  },

  debug(msg) {
    // eslint-disable-next-line no-console
    console.debug(msg)
  },

  warn(msg) {
    console.warn(chalk.yellow(msg))
  },

  error(msg) {
    console.error(chalk.bold.red(msg))
  },

  info(msg) {
    // eslint-disable-next-line no-console
    console.info(chalk.bold.blue(msg))
  },

  silent() {},
}

export function createLogger(logLevel) {
  const logLevelIdx = LOG_LEVELS.indexOf(logLevel)

  return LOG_LEVELS.reduce((logger, type, index) => {
    if (index >= logLevelIdx) {
      logger[type] = defaultLogger[type]
    }
    else {
      logger[type] = defaultLogger.silent
    }
    return logger
  }, {})
}

export function isSubpath(basePath, currentPath) {
  return !path.relative(basePath, currentPath).startsWith('..')
}
