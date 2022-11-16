import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import dotenvExpand from 'dotenv-expand'

function arraify<T>(target: T | T[]): T[] {
  return Array.isArray(target) ? target : [target]
}

interface LookupFileOptions {
  pathOnly?: boolean
  rootDir?: string
  predicate?: (file: string) => boolean
}

export function lookupFile(dir: string, formats: string[], options?: LookupFileOptions): string | undefined {
  for (const format of formats) {
    const fullPath = path.join(dir, format)
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const result = options?.pathOnly ? fullPath : fs.readFileSync(fullPath, 'utf-8')
      if (!options?.predicate || options.predicate(result)) {
        return result
      }
    }
  }
  const parentDir = path.dirname(dir)
  if (parentDir !== dir && (!options?.rootDir || parentDir.startsWith(options?.rootDir))) {
    return lookupFile(parentDir, formats, options)
  }
}

export function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'SERVICE_',
): Record<string, string> {
  if (mode === 'local') {
    throw new Error(
      `"local" cannot be used as a mode name because it conflicts with ` + `the .local postfix for .env files.`,
    )
  }

  prefixes = arraify(prefixes)
  const env: Record<string, string> = {}
  const envFiles = [
    /** default file */ `.env`,
    /** local file */ `.env.local`,
    /** mode file */ `.env.${mode}`,
    /** mode local file */ `.env.${mode}.local`,
  ]

  const parsed = Object.fromEntries(
    envFiles.flatMap((file) => {
      const path = lookupFile(envDir, [file], {
        pathOnly: true,
        rootDir: envDir,
      })
      if (!path) return []
      return Object.entries(dotenv.parse(fs.readFileSync(path)))
    }),
  )

  const expandParsed = dotenvExpand({
    parsed: {
      ...(process.env as any),
      ...parsed,
    },
    // prevent process.env mutation
    ignoreProcessEnv: true,
  } as any).parsed!

  Object.keys(parsed).forEach((key) => {
    parsed[key] = expandParsed[key]
  })

  for (const [key, value] of Object.entries(parsed)) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      env[key] = value
    }
  }

  for (const key in process.env) {
    if (prefixes.some((prefix) => key.startsWith(prefix))) {
      env[key] = process.env[key] as string
    }
  }

  return env
}
