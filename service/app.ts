import express from 'express'
import session from 'express-session'
import { getSessionConfig } from 'utils/getSessionConfig'
import history from 'connect-history-api-fallback'
import { loadEnv } from 'utils/loadEnv'
import { wrapperEnv } from 'utils/env'
import { router } from 'routes'
import colors from 'picocolors'
import { log } from 'utils/log'
import normalizeUrl from 'normalize-url'

const app = express()

const env = loadEnv(process.env.NODE_ENV, '.')

wrapperEnv(env)

const HOST = process.env.SERVICE_HOST
const PORT = process.env.SERVICE_PORT

// 响应头
app.all('*', (req, res, next) => {
  if (req.path !== '/') {
    const { origin, referer } = req.headers
    // https://developer.mozilla.org/en-US/docs/Web/HTTP
    const allowOrigin = origin || referer || '*'
    // cors
    res.set({
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Headers': ['Content-Type', 'Authorization', 'X-Requested-With'],
      'Access-Control-Allow-Methods': ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/json; charset=utf-8',
    })
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session(getSessionConfig()))

router(app)

app.use(history())

app.listen(PORT, () => {
  const pathUrl = normalizeUrl(`http:\/\/${HOST}:${PORT}`, { normalizeProtocol: false })
  log.info(`\n🚀 [后端服务${process.env.NODE_ENV}]: Server running at ${colors.underline(colors.blue(pathUrl))}\n`)
})
