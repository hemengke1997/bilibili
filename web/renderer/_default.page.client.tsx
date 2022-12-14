import ReactDOM from 'react-dom/client'
import type { PageContextBuiltInClient } from 'vite-plugin-ssr/client'
import { createApp } from './createApp'
import { onClientInit } from './client'

export { render }
export const clientRouting = true
export const hydrationCanBeAborted = true

let root: ReactDOM.Root

onClientInit()

async function render(pageContext: PageContextBuiltInClient & PageType.PageContext) {
  const container = document.getElementById('app')!

  if (pageContext.isHydration) {
    root = ReactDOM.hydrateRoot(container, await createApp(pageContext))
  } else {
    if (!root) {
      root = ReactDOM.createRoot(container)
    }
    root.render(await createApp(pageContext))
  }
}

export const prefetchStaticAssets = window.matchMedia('(any-hover: none)').matches
  ? { when: 'VIEWPORT' }
  : { when: 'HOVER' }
