import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { StatusCode } from 'status-code-enum'

const tokenExpire = '12h'
const refreshTokenExpire = '3d'

export function setToken(req: Request, res: Response, _next: NextFunction, body?: Record<any, any>) {
  const { SERVICE_JWT_SECRET } = process.env
  let token
  if (!body) {
    const t = jwt.verify(req.cookies.token, SERVICE_JWT_SECRET, { ignoreExpiration: true })
    token = jwt.sign(t, SERVICE_JWT_SECRET)
  } else {
    token = jwt.sign(body, SERVICE_JWT_SECRET, { expiresIn: tokenExpire })
  }
  if (req.cookies.refreshToken) {
    try {
      jwt.verify(req.cookies.refreshToken, SERVICE_JWT_SECRET)
    } catch {
      // refreshToken过期
      // 401
      return res.status(StatusCode.ClientErrorUnauthorized).json({
        code: StatusCode.ClientErrorUnauthorized,
        message: 'Unauthorized',
        data: null,
      })
    }
  }

  const refreshToken = jwt.sign({}, SERVICE_JWT_SECRET, { expiresIn: refreshTokenExpire })

  // 设置cookie
  res.cookie('token', token, {
    httpOnly: true,
  })
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
  })
}
