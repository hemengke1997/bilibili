// import { getEnv } from './env'

import type session from 'express-session'

export function getSessionConfig() {
  // const env = getEnv()
  return <session.SessionOptions>{
    name: 'SID',
    secret: 'SID',
    resave: true,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    },
  }
}
