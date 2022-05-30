import styles from './Navbar.module.css'
import { useEffect, useState } from 'react'

const Navbar = ({ page, serial, camera, date }) => {
    const [_serial, setSerial] = useState(serial)
    const[_camera, setCamera] = useState(camera || 1)
    const [_date, setDate] = useState(date)

    console.log('Navbar', page, serial, camera, date)

    if (!serial || serial == '' || serial == 'undefined') 
      serial = 'e90e736b799fa757010405a0c7cef017'

    const params = `camera=${camera}&date=${date}`
    const slideshow = `/slideshow/${serial}?${params}`
    const video = `/video/${serial}?${params}`
    const schedule = `/schedule/${serial}?${params}`

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
                <li>
                  <a target="_blank" rel="noreferrer" href="https://docs.google.com/spreadsheets/d/1p0kzwpfcMVxUY0-bpVMEhXfDD_QHNJOiDie5SrEnGSY/edit?usp=sharing">devices</a>
                </li>
            </ul>
        </div>

        <div className={styles.query}>
            <span className={styles.query_item}>
              Date: <input type="date" value={_date} onChange={ 
                (e) => { changeDate(e.currentTarget.value); }
                }  />
            </span>
              &nbsp;&nbsp;
            <span className={styles.query_item}>  
              Serial: <input type="text" size='35' value={_serial} onChange={ 
                (e) => changeSerial(e.currentTarget.value) 
                } />
              </span>
              <span className={styles.query_item}>
                <input type='radio' name='camera' value='1' checked={_camera == 1} onChange={changeCamera}/> camera 1
                <input type='radio' name='camera' value='2' checked={_camera == 2} onChange={changeCamera}/> camera 2
              </span>

        </div>

    </div>
}

export default Navbar