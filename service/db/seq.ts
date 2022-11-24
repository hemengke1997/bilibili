import { Sequelize } from 'sequelize'
// import mysql from 'mysql2'

const { SERVICE_MYSQL_DB, SERVICE_MYSQL_HOST, SERVICE_MYSQL_PORT, SERVICE_MYSQL_PWD, SERVICE_MYSQL_USER } = process.env

// const connection = mysql.createConnection({
//   host: SERVICE_MYSQL_HOST,
//   user: SERVICE_MYSQL_USER,
//   password: SERVICE_MYSQL_PWD,
// })

// connection.query(`CREATE DATABASE IF NOT EXISTS bilibili`)

const seq = new Sequelize(SERVICE_MYSQL_DB, SERVICE_MYSQL_USER, SERVICE_MYSQL_PWD, {
  host: SERVICE_MYSQL_HOST,
  port: SERVICE_MYSQL_PORT,
  dialect: 'mysql',
  define: {
    freezeTableName: true,
  },
})

seq
  .authenticate()
  .then(() => {
    console.log('[seq]: 数据库连接成功')
  })
  .catch((err) => {
    console.log('[seq]: 数据库连接失败', err)
  })

export { seq }
