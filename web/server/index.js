/* eslint-disable */
'use strict'

// server/index.ts
import path2 from 'node:path'
import { fileURLToPath } from 'node:url'
import readline from 'node:readline'
import normalizeUrl from 'normalize-url'
import express from 'express'
import colors2 from 'picocolors'
import { renderPage } from 'vite-plugin-ssr'
import { loadEnv } from 'vite'

// shared/index.ts
import normalize from 'normalize-path'
function getBase() {
  let p
  if (import.meta.env?.VITE_BASEURL) {
    p = import.meta.env.VITE_BASEURL
  } else if (typeof process !== 'undefined') {
    p = process.env.VITE_BASEURL
  }
  return normalize(`${p ?? ''}`, false)
}

// config/vite/utils/helper.ts
import { createHash } from 'node:crypto'
import { isObject } from 'lodash-es'
function injectEnv(envConf) {
  const ret = {}
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

// server/legacy.ts
import path from 'node:path'
import fg from 'fast-glob'
var legacyPolyfillId = 'vite-legacy-polyfill'
var legacyEntryId = 'vite-legacy-entry'
var detectModernBrowserVarName = '__vite_is_modern_browser'
var detectModernBrowserCode = `try{import.meta.url;import("_").catch(()=>1);}catch(e){}window.${detectModernBrowserVarName}=true;`
var systemJSInlineCode = `System.import(document.getElementById('${legacyEntryId}').getAttribute('data-src'))`
var dynamicFallbackInlineCode = `!function(){if(window.${detectModernBrowserVarName})return;console.warn("vite: loading legacy build because dynamic import or import.meta.url is unsupported, syntax error above should be ignored");var e=document.getElementById("${legacyPolyfillId}"),n=document.createElement("script");n.src=e.src,n.onload=function(){${systemJSInlineCode}},document.body.appendChild(n)}();`
var safari10NoModuleFix = `!function(){var e=document,t=e.createElement("script");if(!("noModule"in t)&&"onbeforeload"in t){var n=!1;e.addEventListener("beforeload",(function(e){if(e.target===t)n=!0;else if(!e.target.hasAttribute("nomodule")||!n)return;e.preventDefault()}),!0),t.type="module",t.src=".",e.head.appendChild(t),t.remove()}}();`
var tags = []
async function legacyHtml(pageContext, html) {
  if (!tags.length) {
    const files = fg.sync(`dist/client/assets/js/polyfills.*.entry.js`, {
      onlyFiles: true,
      unique: true,
      deep: 1,
    })
    const modernPolyfill = `${getBase()}${files[0].replace(`dist/client/`, '')}`
    tags.push({
      tag: 'script',
      attrs: {
        type: 'module',
        crossorigin: true,
        src: modernPolyfill,
      },
      injectTo: 'head-prepend',
    })
    tags.push({
      tag: 'script',
      attrs: { nomodule: true },
      children: safari10NoModuleFix,
      injectTo: 'body',
    })
    const manifest = pageContext._manifestClient
    const ks = Object.keys(pageContext._manifestClient)
    const entryJs = pageContext._pageAssets
      ?.filter((t) => t.mediaType === 'text/javascript')
      .map((s) => {
        return {
          ...s,
          src: s.src.replace(new RegExp(getBase()), ''),
        }
      })
      .find((entry) => entry.src.includes('.entry.js') && entry.preloadType === null)
    for (let i = 0; i < ks.length; i++) {
      const { file, isEntry } = manifest[ks[i]]
      const parsed = path.parse(file)
      const realName = parsed.name?.slice(0, parsed.name.indexOf('.'))
      if (realName.includes('polyfills-legacy') && isEntry) {
        tags.push({
          tag: 'script',
          attrs: {
            nomodule: true,
            crossorigin: true,
            src: `${getBase()}${file}`,
            id: legacyPolyfillId,
          },
          injectTo: 'body',
        })
        break
      }
    }
    for (let i = 0; i < ks.length; i++) {
      const k = ks[i]
      const parsed = path.parse(entryJs.src)
      const entryJsName = parsed.name?.slice(0, parsed.name.indexOf('.'))
      const target = manifest[k].file
      if (new RegExp(`${parsed.dir}/${entryJsName}(.+)(.+)${parsed.ext}$`, 'gi').test(target)) {
        tags.push({
          tag: 'script',
          attrs: {
            'nomodule': true,
            'crossorigin': true,
            'data-src': `${getBase()}${target}`,
            'id': legacyEntryId,
          },
          injectTo: 'body',
          children: systemJSInlineCode,
        })
        break
      }
    }
    tags.push({
      tag: 'script',
      attrs: { type: 'module' },
      children: detectModernBrowserCode,
      injectTo: 'head',
    })
    tags.push({
      tag: 'script',
      attrs: { type: 'module' },
      children: dynamicFallbackInlineCode,
      injectTo: 'head',
    })
  }
  const headTags = []
  const headPrependTags = []
  const bodyTags = []
  const bodyPrependTags = []
  for (const tag of tags) {
    if (tag.injectTo === 'body') {
      bodyTags.push(tag)
    } else if (tag.injectTo === 'body-prepend') {
      bodyPrependTags.push(tag)
    } else if (tag.injectTo === 'head') {
      headTags.push(tag)
    } else {
      headPrependTags.push(tag)
    }
  }
  html = injectToHead(html, headPrependTags, true)
  html = injectToHead(html, headTags)
  html = injectToBody(html, bodyPrependTags, true)
  html = injectToBody(html, bodyTags)
  return html
}
var headInjectRE = /([ \t]*)<\/head>/i
var headPrependInjectRE = /([ \t]*)<head[^>]*>/i
var htmlInjectRE = /<\/html>/i
var htmlPrependInjectRE = /([ \t]*)<html[^>]*>/i
var bodyInjectRE = /([ \t]*)<\/body>/i
var bodyPrependInjectRE = /([ \t]*)<body[^>]*>/i
var doctypePrependInjectRE = /<!doctype html>/i
function serializeTags(tags2, indent = '') {
  if (typeof tags2 === 'string') {
    return tags2
  } else if (tags2 && tags2.length) {
    return tags2
      .map(
        (tag) => `${indent}${serializeTag(tag, indent)}
`,
      )
      .join('')
  }
  return ''
}
var unaryTags = /* @__PURE__ */ new Set(['link', 'meta', 'base'])
function incrementIndent(indent = '') {
  return `${indent}${indent[0] === '	' ? '	' : '  '}`
}
function serializeTag({ tag, attrs, children }, indent = '') {
  if (unaryTags.has(tag)) {
    return `<${tag}${serializeAttrs(attrs)}>`
  } else {
    return `<${tag}${serializeAttrs(attrs)}>${serializeTags(children, incrementIndent(indent))}</${tag}>`
  }
}
function prependInjectFallback(html, tags2) {
  if (htmlPrependInjectRE.test(html)) {
    return html.replace(
      htmlPrependInjectRE,
      `$&
${serializeTags(tags2)}`,
    )
  }
  if (doctypePrependInjectRE.test(html)) {
    return html.replace(
      doctypePrependInjectRE,
      `$&
${serializeTags(tags2)}`,
    )
  }
  return serializeTags(tags2) + html
}
function serializeAttrs(attrs) {
  let res = ''
  for (const key in attrs) {
    if (typeof attrs[key] === 'boolean') {
      res += attrs[key] ? ` ${key}` : ``
    } else {
      res += ` ${key}=${JSON.stringify(attrs[key])}`
    }
  }
  return res
}
function injectToBody(html, tags2, prepend = false) {
  if (tags2.length === 0) return html
  if (prepend) {
    if (bodyPrependInjectRE.test(html)) {
      return html.replace(
        bodyPrependInjectRE,
        (match, p1) => `${match}
${serializeTags(tags2, incrementIndent(p1))}`,
      )
    }
    if (headInjectRE.test(html)) {
      return html.replace(
        headInjectRE,
        (match, p1) => `${match}
${serializeTags(tags2, p1)}`,
      )
    }
    return prependInjectFallback(html, tags2)
  } else {
    if (bodyInjectRE.test(html)) {
      return html.replace(bodyInjectRE, (match, p1) => `${serializeTags(tags2, incrementIndent(p1))}${match}`)
    }
    if (htmlInjectRE.test(html)) {
      return html.replace(
        htmlInjectRE,
        `${serializeTags(tags2)}
$&`,
      )
    }
    return `${html}
${serializeTags(tags2)}`
  }
}
function injectToHead(html, tags2, prepend = false) {
  if (tags2.length === 0) return html
  if (prepend) {
    if (headPrependInjectRE.test(html)) {
      return html.replace(
        headPrependInjectRE,
        (match, p1) => `${match}
${serializeTags(tags2, incrementIndent(p1))}`,
      )
    }
  } else {
    if (headInjectRE.test(html)) {
      return html.replace(headInjectRE, (match, p1) => `${serializeTags(tags2, incrementIndent(p1))}${match}`)
    }
    if (bodyPrependInjectRE.test(html)) {
      return html.replace(
        bodyPrependInjectRE,
        (match, p1) => `${serializeTags(tags2, p1)}
${match}`,
      )
    }
  }
  return prependInjectFallback(html, tags2)
}

// server/index.ts
var dir = path2.dirname(fileURLToPath(import.meta.url))
var isDev = process.env.NODE_ENV === 'development' /* development */
var root = `${dir}/..`
var env = loadEnv(process.env.NODE_ENV, root)
var { VITE_PROXY, VITE_APIURL, VITE_HOST } = env
injectEnv(env)
var HOST = VITE_HOST
var PORT = Number(process.env.PORT) || 9527
var port = PORT
async function startServer() {
  const app = express()
  let viteDevServer
  if (isDev) {
    await import('vite').then(async (vite) => {
      viteDevServer = await vite.createServer({
        root,
        appType: 'custom',
        server: {
          middlewareMode: true,
          watch: {
            ignored: ['**/tsconfig.*'],
          },
          cors: true,
          hmr: {
            port: 24990,
          },
        },
      })
      app.use(viteDevServer.middlewares)
    })
    app.set('etag', false)
    app.use((_, res, next) => {
      res.setHeader('Cache-Control', 'no-store')
      next()
    })
  } else {
    const { default: compression } = await import('compression')
    app.use(compression())
    const sirv = (await import('sirv')).default
    app.use(
      getBase(),
      sirv(`${root}/dist/client`, {
        extensions: [],
        etag: true,
      }),
    )
  }
  app.use((_, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next()
  })
  const proxy = VITE_PROXY
  if (proxy) {
    const { createProxyMiddleware } = await import('http-proxy-middleware')
    const rewriteKey = `^${proxy}`
    app.use(
      proxy,
      createProxyMiddleware({
        target: VITE_APIURL,
        changeOrigin: true,
        pathRewrite: {
          [rewriteKey]: '/',
        },
      }),
    )
  }
  app.use((req, _, next) => {
    const url = req.originalUrl
    req.originalUrl = url.replace(/\.html?$/gi, '')
    next()
  })
  app.get('*', async (req, res, next) => {
    try {
      const url = req.originalUrl
      const pageContextInit = {
        urlOriginal: url,
      }
      const pageContext = await renderPage(pageContextInit)
      const { NODE_ENV } = process.env
      const { httpResponse } = pageContext
      if (httpResponse === null) return next()
      const { statusCode, contentType } = httpResponse
      let html = httpResponse.body
      if (!NODE_ENV && NODE_ENV !== 'development') {
        html = await legacyHtml(pageContext, html)
      }
      res.status(statusCode).type(contentType).send(html)
    } catch (e) {
      viteDevServer?.ssrFixStacktrace(e)
      res.status(500).end(e.stack)
    }
  })
  listen(app)
}
function listen(app) {
  const server = app.listen(port, HOST)
  server.on('listening', () => {
    const { START_PAGE } = process.env
    const page = START_PAGE ? `/${START_PAGE}` : ''
    const pathUrl = normalizeUrl(`http://${HOST}:${port}${getBase()}${page}`, { normalizeProtocol: false })
    clearScreen()
    log.info(`
\u{1F680} [\u524D\u7AEF\u670D\u52A1${process.env.NODE_ENV}]: Server running at ${colors2.underline(
      colors2.blue(pathUrl),
    )}
`)
  })
  server.on('error', (error) => {
    clearScreen()
    catchError(error, () => {
      listen(app)
    })
  })
  process.on('SIGINT', () => {
    server.close(() => {
      process.exit(0)
    })
  })
}
try {
  startServer()
} catch {
  process.exit(1)
}
function clearScreen() {
  const repeatCount = process.stdout.rows - 2
  const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : ''
  console.log(blank)
  readline.cursorTo(process.stdout, 0, 0)
  readline.clearScreenDown(process.stdout)
}
function catchError(error, cb) {
  if (error.code !== 'EADDRINUSE') {
    throw error
  }
  log.error(`\u274C ${error}
`)
  port = port + 1
  log.info(`\u{1F525} open port ${port} ...
`)
  cb()
}
