import inquirer from 'inquirer'
import colors from 'picocolors'
import fs from 'fs-extra'
import path from 'node:path'
import { log } from './utils'
import { execa } from 'execa'
import type { Options as ExecaOptions } from 'execa'

enum Type {
  mobile = 'mobile',
  pc = 'pc',
}

export async function run(bin: string, args: string[], opts: ExecaOptions<string> = {}) {
  return execa(bin, args, { stdio: 'inherit', ...opts })
}

function startServer(name: string) {
  run('pnpm', ['run', 'ssr', `--page=${name}`])
}

function getPageName() {
  inquirer
    .prompt([
      {
        type: 'input',
        name: 'pageName',
        message: log.info(`请输入页面名?${colors.dim(colors.gray('(回车默认开发第一个页面):'))}`, false),
      },
    ])
    .then(async (res) => {
      const { pageName } = res
      let name = pageName.replace(/\s/g, '')

      if (!name) {
        const files = fs.readdirSync(path.resolve(__dirname, '../src/pages'))
        name = files[0]
        log.info(`💪  启动\n`)
        startServer(name)
        return
      }
      try {
        fs.readdirSync(path.resolve(__dirname, `../src/pages/${(name as string).toLocaleLowerCase()}`))
        log.warn(`\n💫  [${name}]: 页面已存在,开启dev模式 👀 \n`)
        startServer(name)
      } catch {
        let isMobile = false
        const res = await inquirer.prompt([
          {
            type: 'list',
            name: 'type',
            message: 'PC or 移动端?',
            choices: [Type.pc, Type.mobile],
          },
        ])

        if (res.type === Type.mobile) {
          isMobile = true
        } else {
          isMobile = false
        }
        const config: any = {
          title: name,
          isMobile,
        }

        log.info(`\n🤖 [${name}]:创建页面中...🎈\n`)
        fs.mkdirSync(path.resolve(__dirname, `../src/pages/${name}`))
        fs.mkdirSync(path.resolve(__dirname, `../src/pages/${name}/images`))
        const tsxTpl = fs.readFileSync(path.resolve(__dirname, '../template/index.tsx')).toString()
        fs.writeFileSync(path.resolve(__dirname, `../src/pages/${name}/index.page.tsx`), tsxTpl)

        let serverTpl = fs.readFileSync(path.resolve(__dirname, '../template/server.tpl')).toString()

        serverTpl = serverTpl.replace(/{{(.*?)}}/gi, (_, p1) => {
          return config[p1.trim()]
        })
        fs.writeFileSync(path.resolve(__dirname, `../src/pages/${name}/index.page.server.ts`), serverTpl)

        log.success(
          `✅ 模板创建成功，在 [${colors.underline(
            `src/pages/${name}/index.page.tsx`,
          )}](ctrl + 单击跳转)\n开始愉快的开发吧~ ✨\n`,
        )

        startServer(name)
      }
    })
}

try {
  getPageName()
} catch {
  log.error('😥 oops, some bug occurred\n')
  process.exit(1)
}
