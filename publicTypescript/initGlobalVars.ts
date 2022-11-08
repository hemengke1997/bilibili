;(function () {
  function getDocAttribute(name: string) {
    return document.documentElement.getAttribute(name)
  }
  const isTrue = String(true)
  window.isMobile = getDocAttribute('is-mobile') === isTrue
  window.checkPlatform = getDocAttribute('check-platform') === isTrue
})()

export {}
