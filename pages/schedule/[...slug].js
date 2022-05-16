import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Schedule from '../../components/Schedule'

const Post = () => {
  const [date, setDate] = useState('')
  const [serial, setSerial] = useState('')
  const router = useRouter()

  useEffect(() => {
    const { slug } = router.query
    if (slug) {
      setSerial(slug[0])
      setDate(slug[1])
    }
  }, [router.query])

  if (!serial.length || !date.length) 
    return null

  const timelapseUrl = '/slideshow/' + serial + '?method=azure-small'
  const timelapseLink = <a href={timelapseUrl} target="_blank" rel="noreferrer">Timelapse Link</a>

  return <div style={{margin:'20px'}}>
            <div>
              Date: <input type="date" value={date} onChange={ 
                (e) => { setDate(e.currentTarget.value); console.log('setting date', e.currentTarget.value) }
                }  />
              &nbsp;&nbsp;
              Serial: <input type="text" size='35' value={serial} onChange={ 
                (e) => setSerial(e.currentTarget.value) 
                } />
              &nbsp;&nbsp;
              {timelapseLink}
           </div>

           <Schedule serial={serial} date={date} />
         </div>
}

export default Post