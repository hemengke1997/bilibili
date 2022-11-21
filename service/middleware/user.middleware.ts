import bcryptjs from 'bcryptjs'
import type { Handler } from 'express'
import { userServer } from 'server/user'

export const crpytPassword: Handler = async (req, res, next) => {
  const { password } = req.body

  const salt = bcryptjs.genSaltSync(10)
  const hash = bcryptjs.hashSync(password, salt)

  req.body.password = hash

  next()
}

export const verifyLogin: Handler = async (req, res, next) => {
  const { user_name, password } = req.body

  try {
    const r = await userServer.getUerInfo({ user_name })

    if (!r) {
      next({
        code: '500',
        message: '用户不存在',
        data: '',
      })
      return
    }

    if (!bcryptjs.compareSync(password, r.password)) {
      next({
        code: '500',
        message: '密码不正确',
        data: '',
      })
      return
    }
  } catch (err) {
    return next({
      code: '500',
      message: '用户登录失败',
      result: '',
    })
  }

  next()
}
