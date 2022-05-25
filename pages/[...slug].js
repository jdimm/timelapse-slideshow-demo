import { useRouter } from 'next/router'
//import { useEffect, useState } from 'react'
import Video from '../components/Video'
import Navbar from '../components/Navbar'
import Slideshow from '../components/Slideshow'
import Schedule from '../components/Schedule'
import styles from './index.module.css'
import nice from '../data/nice'
import thousand from '../data/thousand'


const App = () => {
  const router = useRouter()
  console.log('query', router.query)

  const onClick = (e, serial) => {
    e.preventDefault()
    window.location.href = '/' + page + '/' + serial + '?' + 'camera=' + camera + '&date=' + date
  }

  const cameraLinks = (serial, idx) => {
    return <div key={idx} className={styles.link} onClick={ (e) => onClick(e, serial)}>
      {serial}
      </div>
  }

  let page, serial

  const { slug } = router.query
  if (slug && slug.length > 0)
    page = slug[0]
  if (slug && slug.length > 1)
    serial = slug[1]
  
  if (!serial || !page) 
    return null

  const content = null
  let { camera, date } = router.query
  if (!camera)
        camera = 1 
  if (!date)
        date = '2022-05-22'

    const nice_links = nice.map( (serial, idx) => {
      return cameraLinks(serial, idx)
    })
  
    //const thousand_links = thousand.map( (serial, idx) => {
    //  return cameraLinks(serial, idx)
    // })

  if (page === 'video' || page === 'timelapse') {
      content = <Video serial={serial} camera={camera} date={date} />
  } else if (page === 'slideshow') {
      content = (<div>
    <div className={styles.nice_links}>
      {nice_links}
    </div>

    <div className={styles.slideshow}>
      <Slideshow serial={serial} camera={camera} method={'azure-small'}/> 
    </div>
 
    </div>

      )
  } else if (page === 'schedule') {
      content = <Schedule serial={serial} date={date} />
  }

  return <div className={styles.page}>
      <Navbar page={page} serial={serial} camera={camera} date={date} />
      {content}
  </div>
  
}

export default App