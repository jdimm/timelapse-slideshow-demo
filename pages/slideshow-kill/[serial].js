import {useRouter} from 'next/router'
import Slideshow from '../../components/Slideshow'
import Video from '../../components/Video'
import styles from '../index.module.css'

function Index() {
  const router = useRouter()
  let { serial, camera, method } = router.query
  
  if (!method)
    method='http'
  console.log("serial:", serial)
  console.log("method:", method)
  console.log("camera:", camera)

  if (!serial) 
    return null;

  return  <Slideshow serial={serial} camera={camera} method={method}/> 
}

export default Index;