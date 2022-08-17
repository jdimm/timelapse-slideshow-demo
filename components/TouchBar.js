
import styles from './Slideshow.module.css'
import { useState } from 'react'
import { parseNgnxPhoto } from '../util/unpackFilenames'

const TouchBar = ({ photos, batch, index, setIndex, wrongHour, 
	hours, setRange, range, setAnimate, addJournalEntry, serial, camera}) => {
	const [mouseDown, setMouseDown] = useState(false)
    const [seg, setSeg] = useState([0, 0])

	const onXMove = (w, x) => {
		const pc = x / w
		const newIndex = Math.max(0, Math.floor(pc * photos.length) % photos.length)
		if (!wrongHour(hours, photos[newIndex])) setIndex(newIndex)
	}

	const mouseMove = (e) => {
		e.preventDefault()
		const x = e.nativeEvent.offsetX
		const w = e.currentTarget.clientWidth
		onXMove(w, x)
	}

	const touchMove = (e) => {
		e.preventDefault()
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.targetTouches[0].clientX - rect.left
		const w = e.currentTarget.clientWidth
		onXMove(w, x)
	}

	const click = (e) => {
		const r = range
		if (r.start === 0) {
			// First click pick start.
			r.start = index
			setAnimate(false)
		} else if (r.end === photos.length) {
			// Second click pick end.
			r.end = index
		} else {
			// Third click, reset.
			r.start = 0
			r.end = photos.length
		}
		//console.log('range', r)
		setRange( r )
	}

	const onMouseEnter = (e, idx) => {
		//console.log("mouse enter, mousedown", mouseDown)
		e.preventDefault()

		if (mouseDown) {
			if (seg[0] == 0)
				seg[0] = idx
			else
				seg[1] = idx
			setSeg(seg)
		}
			
        setIndex(idx)
	}

	const onMouseDown= (e) => {
		e.preventDefault()
		//console.log("mouse down")
		setMouseDown(true)
		setSeg([0, 0])
	}

	const onMouseUp = (e) => {
	   e.preventDefault()
	   setMouseDown(false)
       // console.log("create journal, seg:", seg, " photos", photos)
	   //const pStart = parseNgnxPhoto(photos[seg[0]])
	   // const pEnd =  parseNgnxPhoto(photos[seg[1]])

	   const pStart = batch.photos[seg[0]].timestamp
	   const pEnd = batch.photos[seg[1]].timestamp
	   if (pStart === pEnd)
		   return

	   // Jamie uses:
	   //"text": "",
	   //"camera": 1,
	   //"start": "1654701695",
	   //"end": "1657394494",
	   //"delay": 100,
	   //"type": "timelapse",
	   //"date": "Thu Aug 11 20:16:08 2022"

/*
	   addJournalEntry ({
		   type:"timelapse",
		   serial: serial,
		   camera: camera,
		   t0: parseInt(pStart),
		   t1: parseInt(pEnd)
	   })
*/     
       const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
	   const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
       const date = new Date();
	   const dayOfWeek = days[date.getDay()]
	   const year = date.getFullYear()
	   const month = months[date.getMonth() + 1]
	   const day = date.getDate()
	   const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
	   const dateString = `${dayOfWeek} ${month} ${day} ${time} ${year}`
	   addJournalEntry ({
		text: '',
		type:"timelapse",
		serial: serial,
		camera: parseInt(camera),
		start: pStart,
		end: pEnd,
		delay: 100,
		date: dateString
	})

	   setSeg([0, 0])
	}

	return (
		<div className={styles.touchBar}
						onMouseDown={onMouseDown}
						onMouseUp={onMouseUp}
		>
			{photos.map((photo, idx) => {
				const skip = wrongHour(hours, photo)
				let color = 'black'
				if (idx >= seg[0] && idx <= seg[1]) color = 'yellow'
				else if (skip) color = 'white'
				else if (idx <= index) color = 'red'

				return (
					<span
						key={idx}
						style={{ color: color }}
						className={styles.touchBarCell}
						onMouseEnter={(e) => onMouseEnter(e,idx)}
					>
						I
					</span>
				)
			})}
		</div>
	)
}

export default TouchBar