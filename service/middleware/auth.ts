import type { ErrorRequestHandler, Handler } from 'express'
import { expressjwt } from 'express-jwt'
import { StatusCode } from 'status-code-enum'
import { setToken } from 'utils/token'

export const handleRefreshToken: ErrorRequestHandler = (_err, req, res, next) => {
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

export const auth: Handler = (req, res, next) => {
  const { SERVICE_JWT_SECRET } = process.env
  expressjwt({
    secret: SERVICE_JWT_SECRET,
    algorithms: ['HS256'],
    credentialsRequired: true,
    getToken: (req) => {
      // cookie
      if (req.cookies.token) {
        return req.cookies.token
      }
      return null
    },
  })
  next()
}
