import express from 'express'
import { userController } from 'controller/user'
import { auth, handleRefreshToken } from 'middleware/auth'
import { crpytPassword, verifyLogin } from 'middleware/user.middleware'

const router = express.Router()

router.post('/login', verifyLogin, userController.login)
router.post('/register', crpytPassword, userController.register)
router.get('/user-info', auth, handleRefreshToken, userController.getUserInfo)

export { router as user }
