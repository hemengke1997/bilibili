import { build } from 'esbuild'
import fs from 'fs-extra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))

const serverDir = path.resolve(dir, '../server/')

async function bundleServer() {
  const result = await build({
    absWorkingDir: process.cwd(),
    entryPoints: [path.join(serverDir, 'index.ts')],
    outfile: 'index.js',
    write: false,
    platform: 'node',
    bundle: true,
    format: 'cjs',
    sourcemap: false,
    treeShaking: true,
    splitting: false,
    banner: {
      js: `/* eslint-disable */\n"use strict"\n`,
    },
    tsconfig: path.resolve(dir, './tsconfig.server.json'),
    plugins: [
      {
        name: 'externalize-deps',
        setup(build) {
          build.onResolve({ filter: /.*/ }, (args) => {
            const id = args.path
            if (id[0] !== '.' && !path.isAbsolute(id)) {
              return {
                external: true,
              }
            }
          })
        },
      },
    ],
  })
  const { text } = result.outputFiles[0]
  const filePath = path.join(serverDir, 'index.js')
  if (fs.existsSync(filePath)) {
    await fs.remove(filePath)
  }
  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, text)
}

bundleServer()
