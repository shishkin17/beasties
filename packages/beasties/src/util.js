import path from 'node:path'
import pc from 'picocolors'

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
    console.warn(pc.yellow(msg))
  },

  error(msg) {
    console.error(pc.bold(pc.red(msg)))
  },

  info(msg) {
    // eslint-disable-next-line no-console
    console.info(pc.bold(pc.blue(msg)))
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
