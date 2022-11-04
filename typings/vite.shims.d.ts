/// <reference types="vite/client" />

declare global {
  var __vite_server_start_time: number
  var __vite_dom_mounted: boolean

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }

  interface ImportMetaEnv {
    readonly VITE_APIPREFIX: '/proxyPrefix' | undefined
    readonly VITE_APIURL: string
    readonly VITE_HOST: string
  }
}

export {}
