import {useRouter} from 'next/router'
import Slideshow from '../../components/Slideshow'
import Video from '../../components/Video'
import styles from '../index.module.css'

function Index() {
  const router = useRouter()
  let { serial, method, camera } = router.query

  if (!method)
    method='http'

  if (!serial) 
    return null;

  return  <Video serial={serial} camera={camera} />
}

export default Index;