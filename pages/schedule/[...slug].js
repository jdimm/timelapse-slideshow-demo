import { useRouter } from 'next/router'
import Schedule from '../../components/Schedule'

const Post = () => {
  const router = useRouter()
  const { slug } = router.query
  if (!slug)
    return null 

  const serial = slug[0]
  const date = slug[1]

  return <Schedule serial={serial} date={date} />
}

export default Post