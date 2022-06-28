import { useRouter } from 'next/router'
//import { useEffect, useState } from 'react'
import Video from '../components/Video'
import Navbar from '../components/Navbar'
import Slideshow from '../components/Slideshow'
import Schedule from '../components/Schedule'
import styles from './index.module.css'
import nice from '../data/nice'
import thousand from '../data/thousand'
import Thumbnails from '../components/Thumbnails'


const App = () => {
  const router = useRouter()
  console.log('App slug query', router.query)

  const onClick = (e, serial) => {
    e.preventDefault()
    window.location.href = '/' + page + '/' + serial + '?' + 'camera=' + camera + '&date='
  }

  const cameraLinks = (serial, idx) => {
    return <div key={idx} className={styles.link} onClick={ (e) => onClick(e, serial)}>
      {serial}
      </div>
  }

  let page
  let serial

  //console.log("serial", serial)
  //console.log("nice", nice)

  const { slug } = router.query
  //console.log('slug', slug)

  if (slug && slug.length > 0)
    page = slug[0]
  if (slug && slug.length > 1)
    serial = slug[1]
  if (slug && slug.length > 2)
    segment = slug[2]
  
  if (!serial || !page) {
    console.log('no serial or page')
    return null
  }

  // console.log("serial", serial)

  let content = null
  let { camera, date, segment } = router.query
  if (!camera)
        camera = 1 
  if (!date)
        date = '2022-05-29'

    const nice_links = nice.map( (serial, idx) => {
      return cameraLinks(serial, idx)
    })
  
    //const thousand_links = thousand.map( (serial, idx) => {
    //  return cameraLinks(serial, idx)
    // })

  if (page === 'video' || page === 'timelapse') {
      content = <Video serial={serial} camera={camera} date={date} />
  } else if (page === 'slideshow') {
      content = (
    <div className={styles.content}>

      <div className={styles.slideshow_holder}>
        <Slideshow serial={serial} camera={camera} segment={segment} method={'azure-small'}/> 
      </div>

      <div className={styles.nice_links}>
        <h3>Examples</h3>
        <Thumbnails />
        {nice_links}
      </div>
 
    </div>

      )
  } else if (page === 'schedule') {
      content = <Schedule serial={serial} date={date} />
  }

  return <div className={styles.page}>
      <Navbar page={page} serial={serial} camera={camera} date={date} segment={segment}/>
      <div className={styles.content}>
        {content}
      </div>
  </div>
  
}

export default App