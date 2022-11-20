/* initGeetest 1.0.0
 * 用于加载id对应的验证码库，并支持宕机模式
 * 暴露 initGeetest 进行验证码的初始化
 * 一般不需要用户进行修改
 */

;(function () {
  if (typeof window === 'undefined') {
    throw new TypeError('Geetest requires browser environment')
  }

  const document = window.document
  const Math = window.Math
  const head = document.getElementsByTagName('head')[0]
  function _Object(obj) {
    this._obj = obj
  }
  _Object.prototype = {
    _each(process) {
      const _obj = this._obj
      for (const k in _obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (_obj.hasOwnProperty(k)) {
          process(k, _obj[k])
        }
      }
      return this
    },
  }
  function Config(config) {
    new _Object(config)._each((key, value) => {
      this[key] = value
    })
  }
  Config.prototype = {
    api_server: 'api.geetest.com',
    protocol: 'http://',
    type_path: '/gettype.php',
    fallback_config: {
      slide: {
        static_servers: ['static.geetest.com', 'dn-staticdown.qbox.me'],
        type: 'slide',
        slide: '/static/js/geetest.0.0.0.js',
      },
      fullpage: {
        static_servers: ['static.geetest.com', 'dn-staticdown.qbox.me'],
        type: 'fullpage',
        fullpage: '/static/js/fullpage.0.0.0.js',
      },
    },
    _get_fallback_config() {
      if (isString(this.type)) {
        return this.fallback_config[this.type]
      } else if (this.new_captcha) {
        return this.fallback_config.fullpage
      } else {
        return this.fallback_config.slide
      }
    },
    _extend(obj) {
      new _Object(obj)._each((key, value) => {
        this[key] = value
      })
    },
  }
  const isNumber = function (value) {
    return typeof value === 'number'
  }
  const isString = function (value) {
    return typeof value === 'string'
  }
  const isBoolean = function (value) {
    return typeof value === 'boolean'
  }
  const isObject = function (value) {
    return typeof value === 'object' && value !== null
  }
  const isFunction = function (value) {
    return typeof value === 'function'
  }
  const callbacks = {}
  const status: any = {}
  const random = function () {
    return parseInt(String(Math.random() * 10000)) + new Date().valueOf()
  }
  const loadScript = function (url, cb) {
    const script = document.createElement('script')

    script.async = true
    script.onerror = function () {
      cb(true)
    }
    let loaded = false
    script.onload = function () {
      if (!loaded) {
        loaded = true
        setTimeout(() => {
          cb(false)
        }, 0)
      }
    }
    script.src = url
    head.appendChild(script)
  }
  const normalizeDomain = function (domain) {
    return domain.replace(/^https?:\/\/|\/$/g, '')
  }
  const normalizePath = function (path) {
    path = path.replace(/\/+/g, '/')
    if (path.indexOf('/') !== 0) {
      path = `/${path}`
    }
    return path
  }
  const normalizeQuery = function (query) {
    if (!query) {
      return ''
    }
    let q = '?'
    new _Object(query)._each((key, value) => {
      if (isString(value) || isNumber(value) || isBoolean(value)) {
        q = `${q + encodeURIComponent(key)}=${encodeURIComponent(value)}&`
      }
    })
    if (q === '?') {
      q = ''
    }
    return q.replace(/&$/, '')
  }
  const makeURL = function (protocol, domain, path, query) {
    domain = normalizeDomain(domain)
    let url = normalizePath(path) + normalizeQuery(query)
    if (domain) {
      url = protocol + domain + url
    }
    return url
  }
  const load = function (protocol, domains, path, query, cb) {
    const tryRequest = function (at) {
      const url = makeURL(protocol, domains[at], path, query)
      loadScript(url, (err) => {
        if (err) {
          if (at >= domains.length - 1) {
            cb(true)
          } else {
            tryRequest(at + 1)
          }
        } else {
          cb(false)
        }
      })
    }
    tryRequest(0)
  }
  const jsonp = function (domains, path, config, callback) {
    if (isObject(config.getLib)) {
      config._extend(config.getLib)
      callback(config)
      return
    }
    if (config.offline) {
      callback(config._get_fallback_config())
      return
    }
    const cb = `geetest_${random()}`
    window[cb] = function (data) {
      if (data.status === 'success') {
        callback(data.data)
      } else if (!data.status) {
        callback(data)
      } else {
        callback(config._get_fallback_config())
      }
      window[cb] = undefined
      try {
        delete window[cb]
      } catch (e) {}
    }
    load(
      config.protocol,
      domains,
      path,
      {
        gt: config.gt,
        callback: cb,
      },
      (err) => {
        if (err) {
          callback(config._get_fallback_config())
        }
      },
    )
  }
  const throwError = function (errorType, config) {
    const errors = {
      networkError: '网络错误',
    }
    if (typeof config.onError === 'function') {
      config.onError(errors[errorType])
    } else {
      throw new TypeError(errors[errorType])
    }
  }
  const detect = function () {
    return !!(window as any).Geetest
  }
  if (detect()) {
    status.slide = 'loaded'
  }
  const initGeetest = function (userConfig, callback) {
    const config = new Config(userConfig)
    if (userConfig.https) {
      config.protocol = 'https://'
    } else if (!userConfig.protocol) {
      config.protocol = `${window.location.protocol}//`
    }
    jsonp([config.api_server || config.apiserver], config.type_path, config, (newConfig) => {
      const type = newConfig.type
      const init = function () {
        config._extend(newConfig)
        callback(new (window as any).Geetest(config))
      }
      callbacks[type] = callbacks[type] || []
      const s = status[type] || 'init'
      if (s === 'init') {
        status[type] = 'loading'
        callbacks[type].push(init)
        load(
          config.protocol,
          newConfig.static_servers || newConfig.domains,
          newConfig[type] || newConfig.path,
          null,
          (err) => {
            if (err) {
              status[type] = 'fail'
              throwError('networkError', config)
            } else {
              status[type] = 'loaded'
              const cbs = callbacks[type]
              for (let i = 0, len = cbs.length; i < len; i = i + 1) {
                const cb = cbs[i]
                if (isFunction(cb)) {
                  cb()
                }
              }
              callbacks[type] = []
            }
          },
        )
      } else if (s === 'loaded') {
        init()
      } else if (s === 'fail') {
        throwError('networkError', config)
      } else if (s === 'loading') {
        callbacks[type].push(init)
      }
    })
  }
  ;(window as any).initGeetest = initGeetest
  return initGeetest
})()

export {}
