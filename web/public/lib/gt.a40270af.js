'use strict'
;(() => {
  ;(function () {
    if (typeof window == 'undefined') throw new TypeError('Geetest requires browser environment')
    let d = window.document,
      m = window.Math,
      j = d.getElementsByTagName('head')[0]
    function f(t) {
      this._obj = t
    }
    f.prototype = {
      _each(t) {
        let n = this._obj
        for (let e in n) n.hasOwnProperty(e) && t(e, n[e])
        return this
      },
    }
    function _(t) {
      new f(t)._each((n, e) => {
        this[n] = e
      })
    }
    _.prototype = {
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
        return h(this.type)
          ? this.fallback_config[this.type]
          : this.new_captcha
          ? this.fallback_config.fullpage
          : this.fallback_config.slide
      },
      _extend(t) {
        new f(t)._each((n, e) => {
          this[n] = e
        })
      },
    }
    let k = function (t) {
        return typeof t == 'number'
      },
      h = function (t) {
        return typeof t == 'string'
      },
      E = function (t) {
        return typeof t == 'boolean'
      },
      x = function (t) {
        return typeof t == 'object' && t !== null
      },
      $ = function (t) {
        return typeof t == 'function'
      },
      c = {},
      l = {},
      G = function () {
        return parseInt(String(m.random() * 1e4)) + new Date().valueOf()
      },
      O = function (t, n) {
        let e = d.createElement('script')
        ;(e.async = !0),
          (e.onerror = function () {
            n(!0)
          })
        let o = !1
        ;(e.onload = function () {
          o ||
            ((o = !0),
            setTimeout(() => {
              n(!1)
            }, 0))
        }),
          (e.src = t),
          j.appendChild(e)
      },
      q = function (t) {
        return t.replace(/^https?:\/\/|\/$/g, '')
      },
      v = function (t) {
        return (t = t.replace(/\/+/g, '/')), t.indexOf('/') !== 0 && (t = `/${t}`), t
      },
      R = function (t) {
        if (!t) return ''
        let n = '?'
        return (
          new f(t)._each((e, o) => {
            ;(h(o) || k(o) || E(o)) && (n = `${n + encodeURIComponent(e)}=${encodeURIComponent(o)}&`)
          }),
          n === '?' && (n = ''),
          n.replace(/&$/, '')
        )
      },
      z = function (t, n, e, o) {
        n = q(n)
        let s = v(e) + R(o)
        return n && (s = t + n + s), s
      },
      w = function (t, n, e, o, s) {
        let r = function (i) {
          let p = z(t, n[i], e, o)
          O(p, (a) => {
            a ? (i >= n.length - 1 ? s(!0) : r(i + 1)) : s(!1)
          })
        }
        r(0)
      },
      I = function (t, n, e, o) {
        if (x(e.getLib)) {
          e._extend(e.getLib), o(e)
          return
        }
        if (e.offline) {
          o(e._get_fallback_config())
          return
        }
        let s = `geetest_${G()}`
        ;(window[s] = function (r) {
          r.status === 'success' ? o(r.data) : r.status ? o(e._get_fallback_config()) : o(r), (window[s] = void 0)
          try {
            delete window[s]
          } catch (i) {}
        }),
          w(e.protocol, t, n, { gt: e.gt, callback: s }, (r) => {
            r && o(e._get_fallback_config())
          })
      },
      y = function (t, n) {
        let e = { networkError: '\u7F51\u7EDC\u9519\u8BEF' }
        if (typeof n.onError == 'function') n.onError(e[t])
        else throw new TypeError(e[t])
      }
    ;(function () {
      return !!window.Geetest
    })() && (l.slide = 'loaded')
    let g = function (t, n) {
      let e = new _(t)
      t.https ? (e.protocol = 'https://') : t.protocol || (e.protocol = `${window.location.protocol}//`),
        I([e.api_server || e.apiserver], e.type_path, e, (o) => {
          let s = o.type,
            r = function () {
              e._extend(o), n(new window.Geetest(e))
            }
          c[s] = c[s] || []
          let i = l[s] || 'init'
          i === 'init'
            ? ((l[s] = 'loading'),
              c[s].push(r),
              w(e.protocol, o.static_servers || o.domains, o[s] || o.path, null, (p) => {
                if (p) (l[s] = 'fail'), y('networkError', e)
                else {
                  l[s] = 'loaded'
                  let a = c[s]
                  for (let u = 0, L = a.length; u < L; u = u + 1) {
                    let b = a[u]
                    $(b) && b()
                  }
                  c[s] = []
                }
              }))
            : i === 'loaded'
            ? r()
            : i === 'fail'
            ? y('networkError', e)
            : i === 'loading' && c[s].push(r)
        })
    }
    return (window.initGeetest = g), g
  })()
})()
