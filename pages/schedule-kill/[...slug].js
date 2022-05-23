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
      const d = slug.length > 1 ? slug[1] : '2022-05-22'

      setDate(d)
    }
  }, [router.query])

  if (!serial.length || !date.length) 
    return null


  return <Schedule serial={serial} date={date} />
  
}

export default Post