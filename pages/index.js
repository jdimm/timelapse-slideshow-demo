import { useState } from 'react'
import Slideshow from '../components/Slideshow'
import nice from '../data/nice'
import styles from './index.module.css'

function Index() {
 // const serial = '816a263e7954a5ceb4cc608f61a89640'
  //const method = 'http'
  const [serial, setSerial] = useState(nice[0])
  const [camera, setCamera] = useState(1)
  const method = 'azure-small'

  const onClick = (e, serial, camera) => {
    setSerial(serial)
    setCamera(camera)
  }

  const links = nice.map( (serial, idx) => {
    return <div key={idx}>
      {serial}
      <span className={styles.link} onClick={ (e) => onClick(e, serial, 1)}>camera 1</span>
      &nbsp;&nbsp;
      <span className={styles.link} onClick={ (e) => onClick(e, serial, 2)}>camera 2</span>
      </div>
  })

  return <div>
    <div className={styles.links}>
      {links}
    </div>
    <div className={styles.slideshow}>
      <Slideshow serial={serial} camera={camera} method={method}/> 
    </div>
  </div>

}

export default Index;