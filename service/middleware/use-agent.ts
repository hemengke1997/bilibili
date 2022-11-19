import type { Handler } from 'express'

export const userAgent: Handler = (req, res, next) => {
  const userAgent = req.get('User-Agent')
  if (userAgent) {
    // google爬虫
    if (userAgent.includes('Googlebot')) {
      // Access is not allowed
      res.status(403).end()
      return
    }
  }
  next()
}
