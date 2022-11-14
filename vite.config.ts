import path from 'node:path'
import dayjs from 'dayjs'
import type { ConfigEnv, UserConfig } from 'vite'
import { loadEnv } from 'vite'
import { LessPluginRemoveAntdGlobalStyles } from 'less-plugin-remove-antd-global-styles'
import { setupVitePlugins } from './config/vite/plugins'
import { setupRollupOptions } from './config/vite/rollupOptions'
import { wrapperEnv } from './config/vite/utils/helper'
import { Env } from './shared/env'
import { getBase } from './shared'

const __APP_INFO__ = {
  lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
}

export default ({ command, ssrBuild, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()

  const isBuild = command === 'build'

  const env = loadEnv(mode, root) as ImportMetaEnv

  wrapperEnv(env)

  return {
    base: getBase(loadEnv),
    mode,
    plugins: [
      setupVitePlugins({
        isBuild,
        ssrBuild: ssrBuild ?? false,
        mode: mode as Env,
      }),
    ],
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
        {
          find: '@root',
          replacement: path.resolve(__dirname),
        },
        {
          find: /^~/,
          replacement: `${path.resolve(__dirname, './node_modules')}/`,
        },
      ],
    },
    css: {
      preprocessorOptions: {
        less: {
          plugins: [new LessPluginRemoveAntdGlobalStyles()],
          javascriptEnabled: true,
          modifyVars: {
            'border-radius-base': '4px',
            'primary-color': '#FF9800',
          },
        },
      },
    },
    define: {
      'process.env': process.env,
      '__APP_INFO__': JSON.stringify(__APP_INFO__),
    },
    ssr: {
      optimizeDeps: {
        disabled: 'build',
      },
      noExternal: isBuild ? ['react-vant', 'pm2'] : [],
    },
    optimizeDeps: {
      include: ['antd/lib/locale/zh_CN'],
    },
    build: {
      emptyOutDir: true,
      cssCodeSplit: true,
      minify: mode === Env.test ? false : 'esbuild',
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2048,
      rollupOptions: setupRollupOptions(root, ssrBuild),
    },
  }
}
