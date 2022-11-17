import clsx from 'clsx'
import styles from './index.module.css'
import x from './index.module.less'

export function Page() {
  return (
    <>
      <div className={clsx('tw-italic', styles.pageA, x.test)}>
        <p>this is page A</p>
        <div className={styles.c1}>
          c1
          <div className={styles.c2}>c2</div>
        </div>
      </div>
    </>
  )
}
