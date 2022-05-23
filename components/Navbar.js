import styles from './Navbar.module.css'
import { useEffect, useState } from 'react'

const Navbar = ({ page, serial, camera, date }) => {
    const [_serial, setSerial] = useState(serial)
    const[_camera, setCamera] = useState(camera || 1)
    const [_date, setDate] = useState(date)

    console.log('Navbar', page, serial, camera, date)

    if (!serial || serial == '' || serial == 'undefined') 
      serial = '816a263e7954a5ceb4cc608f61a89640'

    const params = `camera=${camera}&date=${date}`
    const slideshow = `/slideshow/${serial}?${params}`
    const video = `/video/${serial}?${params}`
    const schedule = `/schedule/${serial}?${params}`

    /*
    const timelapseUrl = '/slideshow/' + serial + '?method=azure-small'
    const timelapseLink = <a href={timelapseUrl} target="_blank" rel="noreferrer">Timelapse Link</a>
    */

    const changeCamera = (e) => {
        const newCamera = e.target.value
        setCamera(newCamera)
        window.location.href = '/' + page + '/' + serial + '?camera=' + newCamera + '&date=' + _date
    }

    const changeSerial = (newSerial) => {
        setSerial(newSerial)
        window.location.href = '/' + page + '/' + newSerial + '?camera=' + _camera + '&date=' + _date
    }

    const changeDate = (newDate) => {
        setDate(newDate)
        window.location.href = '/' + page + '/' + serial + '?camera=' + _camera + '&date=' + newDate
    }



    return <div className='navbar'>
        <div className={styles.page_name}>{page}</div>
        <div className={styles.links}>
            <ul className={styles.link}>
                <li>
                  <a href={slideshow}>slideshow</a>
                </li>
                <li>
                  <a href={video}>video</a>
                </li>
                <li>
                  <a href={schedule}>schedule</a>
                </li>
            </ul>
        </div>

        <div className={styles.query}>
              Date: <input type="date" value={_date} onChange={ 
                (e) => { changeDate(e.currentTarget.value); }
                }  />
              &nbsp;&nbsp;
              Serial: <input type="text" size='35' value={_serial} onChange={ 
                (e) => changeSerial(e.currentTarget.value) 
                } />
              <input type='radio' name='camera' value='1' checked={_camera == 1} onChange={changeCamera}/> camera 1
              <input type='radio' name='camera' value='2' checked={_camera == 2} onChange={changeCamera}/> camera 2

        </div>

    </div>
}

export default Navbar