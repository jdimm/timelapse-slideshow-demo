import { useRouter } from 'next/router'
import Schedule from '../../components/Schedule'

const Post = () => {
  const router = useRouter()
  const { slug } = router.query
  if (!slug)
    return null 

  //console.log(slug)
  //console.log(slug[0])

  const device_id = slug[0]
  const date = slug[1]

  // return <p> schedule: {device_id} {date}</p>
  return <Schedule device_id={device_id} date={date} />
}

export default Post