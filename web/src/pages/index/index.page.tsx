import classnames from 'classnames'
import { useEffect, useState } from 'react'
import { Button, Modal } from 'antd'
import { Link } from '@/components/Link'
import { axiosRequest } from '@/service'

export function Page() {
  const bili = async () => {
    const res = await axiosRequest.get({
      url: '/main/round-sowing',
    })

    console.log(res, 'res')
  }

  useEffect(() => {
    bili()
  }, [])

  const [open, setOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setOpen(true)}>open modal</Button>
      <Modal open={open} onCancel={() => setOpen(false)}>
        this is content
      </Modal>
      <Link href='/a'>to A</Link>
      <div className={classnames('tw-italic')}>this is index</div>
    </>
  )
}
