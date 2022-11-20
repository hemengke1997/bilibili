// 用户相关

import express from 'express'
import { userController } from 'controllers/user'

const router = express.Router()

router.post('/login', userController.login)

export { router as user }
