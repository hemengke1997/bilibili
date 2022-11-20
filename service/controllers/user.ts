import type { Handler } from 'express'
import { setToken } from 'utils/token'

class UserController {
  login: Handler = async (req, res, next) => {
    const { user_name } = req.body

    // 1. 获取用户信息(在token的payload中, 记录id, user_name, is_admin)
    try {
      // 从返回结果对象中剔除password属性, 将剩下的属性放到res对象
      // const { password, ...res } = await getUerInfo({ user_name })
      const r = {
        id: 0,
        user_name,
      }

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
}

const userController = new UserController()

export { userController }
