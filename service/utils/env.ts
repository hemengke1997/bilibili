export enum Env {
  development = 'development',
  test = 'test',
  production = 'production',
}

export function getEnv(): keyof typeof Env {
  return process.env.NODE_ENV
}

export function isDev(): boolean {
  return getEnv() === Env.development
}

export function isTest(): boolean {
  return getEnv() === Env.test
}

export function isProd(): boolean {
  return getEnv() === Env.production
}

export function injectEnv(envConf: Record<string, any>) {
  const ret: any = {}

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName

    ret[envName] = realName
    if (typeof realName === 'string') {
      process.env[envName] = realName
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName)
    }
  }

  return ret
}
