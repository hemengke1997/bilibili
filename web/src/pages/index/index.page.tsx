import classnames from 'classnames'
import { useEffect } from 'react'
import { Button } from 'antd'
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
        password: '12345',
      },
    })

    console.log(res, 'res')
  }

  const getUserInfo = async () => {
    const res = await axiosRequest.get({
      url: '/user/user-info',
    })

    console.log(res, 'res')
  }

  useEffect(() => {
    bili()
    getUserInfo()
  }, [])

  const register = async () => {
    await axiosRequest.post({
      url: '/user/register',
      data: {
        user_name: 'hemengke',
        password: '123456',
      },
    })
  }

  return (
    <>
      <Button type='primary' onClick={() => setVisible(true)}>
        open modal
      </Button>

      <Button onClick={register}>用户注册</Button>
      <Link href='/a'>to A</Link>
      <div className={classnames('tw-italic')}>this is index</div>
    </>
  )
}
