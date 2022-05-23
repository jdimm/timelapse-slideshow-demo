import { useState } from 'react'
import Slideshow from '../components/Slideshow'
import nice from '../data/nice'
import thousand from '../data/thousand'
import styles from './index.module.css'
import Navbar from '../components/Navbar'

function Index() {

  //window.location.href = `/slideshow/${serial}?camera=${camera}&date=${date}`
  //return null

 // const serial = '816a263e7954a5ceb4cc608f61a89640'
  //const method = 'http'
  const [serial, setSerial] = useState(nice[0])
  const [camera, setCamera] = useState(1)
  const method = 'azure-small'

  const onClick = (e, serial, camera) => {
    setSerial(serial)
    setCamera(camera)
  }

  const cameraLinks = (serial, idx) => {
    return <div key={idx}>
      {serial}
      <br />
      <span className={styles.link} onClick={ (e) => onClick(e, serial, 1)}>camera 1</span>
      &nbsp;&nbsp;
      <span className={styles.link} onClick={ (e) => onClick(e, serial, 2)}>camera 2</span>
      </div>
  }

  const nice_links = nice.map( (serial, idx) => {
     return cameraLinks(serial, idx)
  })

  const thousand_links = thousand.map( (serial, idx) => {
    return cameraLinks(serial, idx)
 })

 const url = `/slideshow/${serial}`
 return (
   <meta httpEquiv="refresh" content="0; url={url}"></meta>
 )

  return <div>
    <Navbar page="slideshow"/>
    <div className={styles.nice_links}>
      {nice_links}
    </div>
    <div className={styles.slideshow}>
      <Slideshow serial={serial} camera={camera} method={method}/> 
    </div>
    <div className={styles.thousand_links}>
      {thousand_links}
    </div>
  </div>

}

export default Index;