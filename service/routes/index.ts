import type { Application } from 'express'
import { bilibili } from './api.bilibili.com'
import { main } from './main'

export function router(app: Application) {
  app.use('/bilibili', bilibili)

  app.use('/main', main)
}
