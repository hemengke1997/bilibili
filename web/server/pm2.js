/* eslint-disable */
'use strict'

// server/pm2.ts
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import pm2 from 'pm2'

// scripts/utils.ts
import colors from 'picocolors'
var log = {
  info: (str, log2 = true) => {
    return log2 ? console.log(colors.cyan(str)) : colors.cyan(str)
  },
  error: (str, log2 = true) => {
    return log2 ? console.log(colors.red(str)) : colors.cyan(str)
  },
  success: (str, log2 = true) => {
    return log2 ? console.log(colors.green(str)) : colors.cyan(str)
  },
  warn: (str, log2 = true) => {
    return log2 ? console.log(colors.yellow(str)) : colors.cyan(str)
  },
}

// server/pm2.ts
var dir = path.dirname(fileURLToPath(import.meta.url))
var processName = `process-name`
var isDev = process.env.NODE_ENV === 'development'
var options = isDev
  ? {
      exec_mode: 'fork',
    }
  : {
      exec_mode: 'cluster',
      instances: 0,
      node_args: '--harmony',
      env: {
        NODE_ENV: process.env.NODE_ENV,
      },
    }
async function runPm2() {
  pm2.connect((err) => {
    if (err) {
      log.error(`
[pm2]: connect error
${err}`)
      process.exit(1)
    }
    pm2.reload(processName, (e) => {
      if (e) {
        pm2.start(
          {
            script: path.resolve(dir, './index.js'),
            name: processName,
            watch: false,
            ...options,
          },
          (err2) => {
            log.info(`
[pm2]: start`)
            if (err2) {
              log.error(`
[pm2]: start error 
 ${err2}`)
              log.info(`
[pm2]: restart`)
              pm2.reload(processName, () => {
                log.success(`
[pm2]: reload success`)
              })
            }
            log.success(`
[pm2]: start success`)
          },
        )
      } else {
        log.success(`
[pm2]: reload success`)
      }
    })
  })
}
try {
  runPm2()
} catch {
  log.error(`
[pm2]: something wrong`)
  process.exit(1)
}
