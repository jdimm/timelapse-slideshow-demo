import styles from './Navbar.module.css'
import { useEffect, useState } from 'react'

const Navbar = ({ page, serial, camera, date, segment, email }) => {
    const [_serial, setSerial] = useState(serial)
    const[_camera, setCamera] = useState(camera || 1)
    const [_date, setDate] = useState(date)
    const [_segment, setSegment] = useState(segment)
    const [emailCompletions, setEmailCompletions] = useState([])
    // const [selectedEmail, setSelectedEmail] = useState('')

    var selectedEmail = email

    if (!serial || serial == '' || serial == 'undefined') 
      serial = 'e90e736b799fa757010405a0c7cef017'

    const params = `camera=${camera}&date=${date}`
    const slideshow = `/slideshow/${serial}?${params}`
    const video = `/video/${serial}?${params}`
    const schedule = `/schedule/${serial}?${params}`

    const href = (page, serial, camera, date, segment) => {
      const params = `/${page}/${serial}?camera=${camera}&date=${date}&segment=${segment}`
      if (selectedEmail)
        params += `&email=${selectedEmail}` 
      return params
    }

    const changeCamera = (e) => {
        const newCamera = e.target.value
        setCamera(newCamera)
        window.location.href = href(page, serial, newCamera, _date, _segment)
    }

    const changeSerial = (newSerial) => {
        if (newSerial.length === 4) {
          const url = '/api/last4/' + newSerial
          fetch(url).then(function(response) {
            return response.json()
          }).then(function(data) {
            setSerial(data.serial)
            const newHref = href(page, data.serial, _camera, _date, _segment)
            console.log("new href", newHref)
            window.location.href = newHref
          })
        } else if (newSerial.length === 32) {
          setSerial(newSerial)
          window.location.href = href(page, newSerial, _camera, _date, _segment)
        }
    }

    const changeDate = (newDate) => {
        setDate(newDate)
        window.location.href = href(page, serial, _camera, newDate, _segment)
    }

    const changeSegment= (e) => {
      const newSegment = e.currentTarget.value
      setSegment (newSegment)
      window.location.href = href(page, serial, _camera, _date, newSegment)
    }

    const searchEmail = async (e) => {
      e.preventDefault()
      const email = e.target.value 
      console.log('searchEmail email', email)
      const response = await fetch(`/api/device/${email}`)
      const json = await response.json()
      console.log('searchEmail json', json)

      // If there is only one, and it's the one in the input box, we have a serial!
      if (json.length == 1 && json[0].email == email) {
        // setSelectedEmail(email)
        selectedEmail = email
        changeSerial(json[0].serial)
      }
      else
        setEmailCompletions(json)
    }

    return ( <div className='navbar'>
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
							<a
								target='_blank'
								rel='noreferrer'
								href='https://docs.google.com/spreadsheets/d/1p0kzwpfcMVxUY0-bpVMEhXfDD_QHNJOiDie5SrEnGSY/edit?usp=sharing'
							>
								devices
							</a>
						</li>
					</ul>
				</div>

				<div className={styles.query}>
	
					<span className={styles.query_item}>
						Email: <input type='text' size='25' onChange={searchEmail} defaultValue={email} list='email-list' />
						<datalist id='email-list'>
							{emailCompletions.map((item, key) => (
								<option key={key} value={item.email} />
							))}
						</datalist>
					</span>
          &nbsp;&nbsp;
					<span className={styles.query_item}>
						Serial:{' '}
						<input
							type='text'
							size='35'
							defaultValue={_serial}
							onChange={(e) => changeSerial(e.currentTarget.value)}
						/>
					</span>
					<br />
					<span className={styles.query_item}>
						<input
							type='radio'
							name='camera'
							value='1'
							checked={_camera == 1}
							onChange={changeCamera}
						/>{' '}
						camera 1
						<input
							type='radio'
							name='camera'
							value='2'
							checked={_camera == 2}
							onChange={changeCamera}
						/>{' '}
						camera 2
					</span>
					<span className={styles.query_item}>
						<input
							type='radio'
							name='segment'
							value='first'
							checked={_segment == 'first'}
							onChange={changeSegment}
						/>{' '}
						first
						<input
							type='radio'
							name='segment'
							value='last'
							checked={_segment == 'last'}
							onChange={changeSegment}
						/>{' '}
						last
					</span>


          <span className={styles.query_item}>
						Date:{' '}
						<input
							type='date'
							value={_date}
							onChange={(e) => {
								changeDate(e.currentTarget.value)
							}}
						/>
					</span>
					&nbsp;&nbsp;
				</div>
			</div>
		)
}

export default Navbar