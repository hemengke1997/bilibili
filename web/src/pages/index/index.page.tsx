import clsx from 'clsx'
import { useEffect } from 'react'
import { axiosRequest } from '@/service'

export function Page() {
  const login = async () => {
    await axiosRequest.get({
      url: '/v1/login',
    })
  }

  useEffect(() => {}, [login()])

  return (
    <>
      <div className={clsx('tw-italic')}>this is index</div>
    </>
  )
}
