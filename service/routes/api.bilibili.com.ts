import express from 'express'
import axios from 'axios'

const router = express.Router()

router.get('/stat', async (req, res, _next) => {
  const { mid } = req.query
  const r = await axios.get(`https://api.bilibili.com/x/relation/stat?vmid=${mid}`)

  res.status(r.status).send(r.data)
})

export { router as bilibili }
