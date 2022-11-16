import express from 'express'

const router = express.Router()

router.get('/login', (_, res, next) => {
  res.send('login')
  next()
})

export { router as v1 }
