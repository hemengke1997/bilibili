declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'test' | 'production'
    SERVICE_HOST: string
    SERVICE_PORT: string
    SERVICE_JWT_SECRET: string
  }
}
