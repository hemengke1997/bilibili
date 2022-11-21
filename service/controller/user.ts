import type { Handler } from 'express'
import { setToken } from 'utils/token'
import { userServer } from 'server/user'

class UserController {
  login: Handler = async (req, res, next) => {
    const { user_name } = req.body

    // 1. 获取用户信息(在token的payload中, 记录id, user_name, is_admin)
    try {
      // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
      const { _password, ...r } = await userServer.getUerInfo({ user_name })

      const result = setToken(req, res, next, r)

      if (result) {
        return result
      } else {
        return res.json({
          code: 0,
          message: '登录成功',
        })
      }
    } catch (err) {
      console.error('用户登录失败', err)
    }
  }

  register: Handler = async (req, res, next) => {
    const { user_name, password } = req.body

    try {
      const r = await userServer.createUser(user_name, password)
      res.json({
        code: 0,
        message: '用户注册成功',
        result: {
          id: r.id,
          user_name: r.user_name,
        },
      })
    } catch (err) {
      if (err.name === 'SequelizeUniqueConstraintError') {
        next({
          code: '500',
          message: '用户名已存在',
          result: '',
        })
      } else {
        next(err)
      }
    }
  }

  getUserInfo: Handler = (req, res) => {
    res.json({
      code: 0,
      message: 'success',
      data: {
        name: 'hahaha',
      },
    })
  }
}

const userController = new UserController()

export { userController }
