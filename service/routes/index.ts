import type { Application } from 'express'
import { main } from './main'
import { user } from './user'

export function router(app: Application) {
  app.use('/main', main)
  app.use('/user', user)
}
