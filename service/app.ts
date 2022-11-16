import express from 'express'
import session from 'express-session'
import { getSessionConfig } from 'utils/getSessionConfig'
import history from 'connect-history-api-fallback'
import { loadEnv } from 'utils/loadEnv'
import { wrapperEnv } from 'utils/env'
import { router } from 'routes'

const app = express()

const env = loadEnv(process.env.NODE_ENV, '.')

wrapperEnv(env)

// 响应头
app.all('*', (req, res, next) => {
  const { origin, referer } = req.headers
  // https://developer.mozilla.org/en-US/docs/Web/HTTP
  const allowOrigin = origin || referer || '*'
  // cors
  res.header('Access-Control-Allow-Origin', allowOrigin)

  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Credentials', '*')
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(session(getSessionConfig()))

router(app)

app.use(history())

app.listen(process.env.SERVICE_PORT, () => {
  console.log(`[service]: 端口号 ${process.env.SERVICE_PORT}`)
})
