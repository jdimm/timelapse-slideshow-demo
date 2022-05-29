import { useState } from 'react'
import Slideshow from '../components/Slideshow'
import nice from '../data/nice'
import thousand from '../data/thousand'
import styles from './index.module.css'
import Navbar from '../components/Navbar'

function Index() {
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

 //const url = `/slideshow/${serial}`
 //return (
 //  <meta httpEquiv="refresh" content="0; url={url}"></meta>
 //)

 console.log('the new index.js')
 return <div>wtf</div>

  return <div>
    <Navbar page="slideshow"/>
    <div className={styles.nice_links}>
      {nice_links}
    </div>
    <div className={styles.slideshow}>
      <Slideshow serial={serial} camera={camera} method={method}/> 
    </div>
  </div>

}

export default Index;