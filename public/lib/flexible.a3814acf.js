'use strict'
;(() => {
  ;(function () {
    if (typeof window > 'u') return
    let t = document.documentElement.getAttribute('is-mobile') === 'true' ? 'mobile' : 'pc',
      i = {
        pc: { maxWidth: 1920, minWidth: 1300, UIWidth: 1920 },
        mobile: { maxWidth: 750, minWidth: 0, UIWidth: 750 },
      }
    function n() {
      let e = window.innerWidth
      e > window.screen.width ||
        (e >= i[t].maxWidth ? (e = i[t].maxWidth) : e <= i[t].minWidth && (e = i[t].minWidth),
        (document.documentElement.style.fontSize = `${(e * 16) / i[t].UIWidth}px`))
    }
    n()
    let d,
      o = 60
    window.addEventListener('resize', () => {
      clearTimeout(d), (d = setTimeout(n, o))
    }),
      window.addEventListener('pageshow', (e) => {
        e.persisted && (clearTimeout(d), (d = setTimeout(n, o)), n())
      })
  })()
})()
