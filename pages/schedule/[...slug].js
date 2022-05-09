import { useRouter } from 'next/router'
import { useState } from 'react'
import Schedule from '../../components/Schedule'

const Post = () => {
 
  const router = useRouter()
  const { slug } = router.query
  if (!slug)
    return null 

  const _serial = slug[0]
  const _date = slug[1]
  const [date, setDate] = useState(_date)
  const [serial, setSerial] = useState(_serial)

  return <div style={{margin:'20px'}}>
            <div>
              Date: <input type="date" value={date} onChange={ 
                (e) => setDate(e.currentTarget.value) 
                }  />
              &nbsp;&nbsp;
              Serial: <input type="text" size='35' value={serial} onChange={ 
                (e) => setSerial(e.currentTarget.value) 
                } />
           </div>

           <Schedule serial={serial} date={date} />
         </div>
}

export default Post