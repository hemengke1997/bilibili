import type { Handler } from 'express'
import log4js from 'log4js'

log4js.configure({
  appenders: {
    console: {
      type: 'console',
    },
    access: {
      type: 'dateFile',
      filename: 'log/access.log',
      pattern: '-yyyy-MM-dd',
    },
    errorFile: {
      type: 'file',
      filename: 'log/errors.log',
    },
    errors: {
      type: 'logLevelFilter',
      level: 'ERROR',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      appenders: ['console'],
      level: 'DEBUG',
    },
    http: {
      appenders: ['access', 'errors'],
      level: 'INFO',
    },
  },
})

const log = log4js.getLogger('bilibili')

export const logger: Handler = (req, _res, next) => {
  log.info('====== visit api server ======')
  log.info(`url: ${req.url}`)
  const path = req.path
  if (!path.includes('transfer')) {
    const query = req.query
    const body = req.body
    log.info(`origin: ${req.get('Origin')}`)
    log.info(`query: ${JSON.stringify(query)}`)
    log.info(`body: ${JSON.stringify(body)}`)
  } else if (path.includes('transfer')) {
    log.info(`referer: ${req.get('Referer')}`)
  }
  next()
}
