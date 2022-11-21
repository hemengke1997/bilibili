declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'test' | 'production'
    SERVICE_HOST: string
    SERVICE_PORT: string
    SERVICE_JWT_SECRET: string
    SERVICE_MYSQL_HOST: string
    SERVICE_MYSQL_PORT: number
    SERVICE_MYSQL_USER: string
    SERVICE_MYSQL_PWD: string
    SERVICE_MYSQL_DB: string
  }
}
