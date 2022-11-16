import type { Application } from 'express'
import { v1 } from './v1'

export function router(app: Application) {
  app.use('/v1', v1)
}
