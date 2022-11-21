import { userModel } from 'model/user'

class UserServer {
  async createUser(user_name, password) {
    const res = await userModel.create({ user_name, password })
    return res.dataValues
  }

  async getUerInfo({
    id,
    user_name,
    password,
    is_admin,
  }: Partial<{ id: string; user_name: string; password: string; is_admin: number | boolean }>) {
    const whereOpt = {}

    id && Object.assign(whereOpt, { id })
    user_name && Object.assign(whereOpt, { user_name })
    password && Object.assign(whereOpt, { password })
    is_admin && Object.assign(whereOpt, { is_admin })

    const res = await userModel.findOne({
      attributes: ['id', 'user_name', 'password', 'is_admin'],
      where: whereOpt,
    })

    return res ? res.dataValues : null
  }

  async updateById({ id, user_name, password, is_admin }) {
    const whereOpt = { id }
    const newUser = {}

    user_name && Object.assign(newUser, { user_name })
    password && Object.assign(newUser, { password })
    is_admin && Object.assign(newUser, { is_admin })

    const res = await userModel.update(newUser, { where: whereOpt })
    return res[0] > 0
  }
}

export const userServer = new UserServer()
