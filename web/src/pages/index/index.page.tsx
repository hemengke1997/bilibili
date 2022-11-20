import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { Link } from '@/components/Link'
import { axiosRequest } from '@/service'
import { useLoginModalStore } from '@/components/pc/LoginModal/hooks/useLoginModalStore'

export function Page() {
  const { setVisible } = useLoginModalStore((state) => ({
    setVisible: state.setVisible,
  }))
  const bili = async () => {
    const res = await axiosRequest.post({
      url: '/user/login',
      data: {
        user_name: 'hemengke',
      },
    })

    console.log(res, 'res')
  }

  useEffect(() => {
    bili()
  }, [])

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button type='primary' onClick={() => setVisible(true)}>
        open modal
      </Button>
      <Modal open={open} onCancel={() => setOpen(false)}>
        this is content
      </Modal>
      <Link href='/a'>to A</Link>
      <div className={classnames('tw-italic')}>this is index</div>
    </>
  )
}
