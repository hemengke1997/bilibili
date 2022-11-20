import type { ErrorRequestHandler } from 'express'
import express from 'express'
import history from 'connect-history-api-fallback'
import { loadEnv } from 'utils/loadEnv'
import { wrapperEnv } from 'utils/env'
import { router } from 'routes'
import colors from 'picocolors'
import { log } from 'utils/log'
import normalizeUrl from 'normalize-url'
import { logger } from 'middleware/logger'
import { userAgent } from 'middleware/use-agent'
import cors from 'cors'
import { expressjwt } from 'express-jwt'
import cookieParser from 'cookie-parser'
import { setToken } from 'utils/token'
import { StatusCode } from 'status-code-enum'

const app = express()

const env = loadEnv(process.env.NODE_ENV, '.')

wrapperEnv(env)

const HOST = env.SERVICE_HOST
const PORT = env.SERVICE_PORT

app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(logger)
app.use(history())
app.use(userAgent)

const handleRefreshToken: ErrorRequestHandler = (_err, req, res, next) => {
  // token 过期处理
  if (req.cookies.refreshToken && req.cookies.token) {
    try {
      const t = setToken(req, res, next)
      if (t) {
        return t
      }
      next()
    } catch (e) {
      next(e)
    }
  }

  res.status(StatusCode.ClientErrorUnauthorized).end()
}

app.use(
  expressjwt({
    secret: env.SERVICE_JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: false,
    getToken: (req) => {
      // cookie
      if (req.cookies.token) {
        return req.cookies.token
      }
      return null
    },
  }),
  handleRefreshToken,
)

router(app)

app.listen(PORT, () => {
  const pathUrl = normalizeUrl(`http:\/\/${HOST}:${PORT}`, { normalizeProtocol: false })
  log.info(`\n🚀 [后端服务${process.env.NODE_ENV}]: Server running at ${colors.underline(colors.blue(pathUrl))}\n`)
})
