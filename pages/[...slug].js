import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Video from '../components/Video'
import Navbar from '../components/Navbar'
import Slideshow from '../components/Slideshow'
import Schedule from '../components/Schedule'
import styles from './index.module.css'
import nice from '../data/nice'
import thousand from '../data/thousand'
import Thumbnails from '../components/Thumbnails'
import Journal from '../components/Journal'

const App = () => {
  const router = useRouter()
  const [forceRedraw, setForceRedraw] = useState(false)
  const [journal, setJournal] = useState( []);

  useEffect(() => {
    const lj = localStorage.getItem('journal')
    try {
      const localJournal = JSON.parse(lj)
    } catch (e) {
      timer('error parsing journal', e)
    }

    if (localJournal && Array.isArray(localJournal) && localJournal.length > 0) {
      setJournal(localJournal)
    }
  }, [router.query])

  const addJournalEntry = (entry) => {
    const newJournal = [...journal, entry]
    setJournal(newJournal)
    updateMemory(newJournal)
  }

  const updateMemory = (newJournal) => {
    const jStr = JSON.stringify(newJournal)
    localStorage.setItem('journal', jStr)
  }

  const deleteMemory = (index) => {
    const newJournal = [...journal]
    newJournal.splice(index, 1)
    setJournal(newJournal)
    updateMemory(newJournal)
  }

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

  const { slug } = router.query

  if (slug && slug.length > 0)
    page = slug[0]
  if (slug && slug.length > 1)
    serial = slug[1]
  if (slug && slug.length > 2)
    segment = slug[2]
  
  if (!serial || !page) {
    return null
  }

  let content = null
  let { camera, date, segment } = router.query
  if (!camera)
        camera = 1 
  if (!date)
        date = '2022-05-29'
  if (!segment)
        segment = 'first'

    const nice_links = nice.map( (serial, idx) => {
      return cameraLinks(serial, idx)
    })

  if (page === 'video' || page === 'timelapse') {
      content = <Video serial={serial} camera={camera} date={date} />
  } else if (page === 'slideshow') {
      content = (
    <div className={styles.content}>

      <div className={styles.slideshow_holder}>
        <Slideshow serial={serial} camera={camera} segment={segment} method={'azure-small'}
          layout='standard' addJournalEntry={addJournalEntry}/> 

        <div className={styles.nice_links}>
          <h3>Examples</h3>
          <Thumbnails />
          {nice_links}
        </div>

      </div>

      <div className={styles.journal_holder}>
         <Journal journal={journal} updateMemory={updateMemory} deleteMemory={deleteMemory}/>
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