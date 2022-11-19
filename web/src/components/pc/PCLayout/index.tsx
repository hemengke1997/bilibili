import { ConfigProvider } from 'antd'
import zh_CN from 'antd/locale/zh_CN'
import '@/assets/style/pc/index.css'

function PCLayout({ children }: { children: React.ReactNode }) {
  return (
    <ConfigProvider
      locale={zh_CN}
      autoInsertSpaceInButton={false}
      theme={{
        token: {
          colorPrimary: '#ec4141',
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export { PCLayout }
