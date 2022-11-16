import clsx from 'clsx'
import { useEffect } from 'react'
import { axiosRequest } from '@/service'

export function Page() {
  const login = async () => {
    const res = await axiosRequest.get({
      url: '/v1/login',
    })

    console.log(res, 'res')
  }

  useEffect(() => {}, [login()])

  return (
    <>
      <div className={clsx('tw-italic')}>this is index</div>
    </>
  )
}
