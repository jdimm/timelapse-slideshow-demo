import {useRouter} from 'next/router'
import Slideshow from '../../components/Slideshow'
import Video from '../../components/Video'
import styles from '../index.module.css'

function Index() {
  const router = useRouter()
  const { serial } = router.query

  if (!serial) 
    return null;

  return ( 
  <div className={styles.timelapse}>

    <table>
      <tbody>
        <tr><th>camera 1</th><th>camera 2</th></tr>
        <tr>
          <td>
            <Slideshow serial={serial} camera={1} /> 
          </td>
          <td>
            <Slideshow serial={serial} camera={2}/>
          </td>
        </tr>
      </tbody>
    </table>

  </div>

  )
}

export default Index;