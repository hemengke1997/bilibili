import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { bundle } from './bundle'

const dir = path.dirname(fileURLToPath(import.meta.url))

const serverDir = path.resolve(dir, '../server/')

bundle(path.join(serverDir, 'index.ts'), path.join(serverDir, 'index.js'))
