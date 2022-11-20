import { Modal } from 'antd'
import type { FC } from 'react'
import { getLibAssets } from '@root/shared'
import { Helmet } from 'react-helmet'
import manifest from '@root/publicTypescript/manifest.json'
import { useLoginModalStore } from './hooks/useLoginModalStore'
import { LoginContent } from './components/LoginContent'

const LoginModal: FC = () => {
  const { visible, setVisible } = useLoginModalStore((state) => ({
    visible: state.visible,
    setVisible: state.setVisible,
  }))

  return (
    <div>
      <Helmet>
        <script async src={getLibAssets(manifest.gt)} type='text/javascript' />
      </Helmet>
      <Modal open={visible} centered footer={null} onCancel={() => setVisible(false)} maskClosable={false}>
        <LoginContent />
      </Modal>
    </div>
  )
}

export { LoginModal }
