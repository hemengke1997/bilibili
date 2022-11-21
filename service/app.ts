import type { ErrorRequestHandler } from 'express'
import express from 'express'
import history from 'connect-history-api-fallback'
import { loadEnv } from 'utils/loadEnv'
import { injectEnv } from 'utils/env'
import colors from 'picocolors'
import { log } from 'utils/log'
import normalizeUrl from 'normalize-url'
import { logger } from 'middleware/logger'
import { userAgent } from 'middleware/use-agent'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const env = loadEnv(process.env.NODE_ENV, '.')

injectEnv(env)

const HOST = env.SERVICE_HOST
const PORT = env.SERVICE_PORT

app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(history())
app.use(userAgent)
app.use(logger)

await import('routes').then(({ router }) => {
  router(app)
})

const handleError: ErrorRequestHandler = (err, req, res, next) => {
  res.status(500).json(err)
  next()
}
app.use(handleError)

app.listen(PORT, () => {
  const pathUrl = normalizeUrl(`http:\/\/${HOST}:${PORT}`, { normalizeProtocol: false })
  log.info(`\n🚀 [后端服务${process.env.NODE_ENV}]: Server running at ${colors.underline(colors.blue(pathUrl))}\n`)
})
