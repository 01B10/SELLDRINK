import styles from './Loader.module.scss'
import { pause } from '../../utils/pause'
import { useState } from 'react'

const Loader = () => {
  const [isLoading, setIsLoading] = useState(true)
  pause(2000).then(() => setIsLoading(false))
  return (
    <div
      className={`${styles.preloader} ${
        !isLoading ? 'opacity-0 pointer-events-none ' : 'opacity-100'
      } transition-opacity duration-1000`}
    >
      <div className={styles.wrapLoading}>
        <div className={styles.loader}>Loading...</div>
      </div>
    </div>
  )
}

export default Loader