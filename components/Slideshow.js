import React, { useState, useEffect, useRef } from 'react'
import styles from './Slideshow.module.css'
import { epochToTimestamp, timestampToEpoch } from '../util/timestamp'
import Zoom from './Zoom'
import TouchBar from './TouchBar'
import Slack from './Slack'
import { parseNgnxPhoto, parseAzurePhoto } from '../util/unpackFilenames'

function dateToString(date) {
	const d = new Date(date)
	return (
		d.getFullYear() +
		'-' +
		(d.getMonth() + 1).toString().padStart(2, '0') +
		'-' +
		d.getDate().toString().padStart(2, '0')
	)
}

const HourSelect = ({ hours, toggleHour }) => {
	return (
		<div className={styles.hourSelect}>
			{hours.map((hour, idx) => {
				return (
					<span key={idx}>
						<input type='checkbox' defaultChecked={hour} onChange={(e) => toggleHour(e, idx)} />
						{idx} &nbsp;
					</span>
				)
			})}
		</div>
	)
}

const Slideshow = ({ serial, camera, segment, layout, addJournalEntry, t0, t1, method}) => {
	const [index, setIndex] = useState(t0)
	const [animate, setAnimate] = useState(false)
	const [photos, setPhotos] = useState([])
	const [preloadedImages, setPreloadedImages] = useState([])
	const [hours, setHours] = useState([])
	const [range, setRange] = useState({})
	const [stopAt, setStopAt] = useState(-1)
	const [direction, setDirection] = useState(1)
	const [slideshowStyle, setSlideshowStyle] = useState(styles.slideshow)
	const [hiresImageUrl, setHiresImageUrl] = useState('')
	const [batch, setBatch] = useState([])

	const animateRef = useRef(animate)
	const indexRef = useRef(index)
	const stopAtRef = useRef(stopAt)
	const directionRef = useRef(direction)
	const rangeRef = useRef(range)
	const photosRef = useRef(photos)
	const hoursRef = useRef(hours)

	// const method = 'azure-small'

	useEffect(() => {
		// Use a ref to communicate the animate state to the
		// setInterval in the next useEffect.  This useEffect
		// runs every time.
		animateRef.current = animate
		indexRef.current = index
		stopAtRef.current = stopAt
		directionRef.current = direction
		rangeRef.current = range
		photosRef.current = photos
		hoursRef.current = hours
	})

	useEffect(() => {
		if (!serial) return

		// method = 'azure-small'

		//if (method == 'azure-small') {
			getPhotosAzure()
		//} else if (method == 'http') {
		//	getPhotosNginx()
		//}

	}, [serial, camera])

	const onXMove = (w, x) => {
		const pc = x / w
		const newIndex = Math.max(0, Math.floor(pc * photos.length) % photos.length)
		if (!wrongHour(hours, photos[newIndex])) setIndex(newIndex)
	}

	const mouseMove = (e) => {
		const x = e.nativeEvent.offsetX
		const w = e.currentTarget.clientWidth
		onXMove(w, x)
	}

	const touchMove = (e) => {
		const rect = e.currentTarget.getBoundingClientRect()
		const x = e.targetTouches[0].clientX - rect.left
		const w = e.currentTarget.clientWidth
		onXMove(w, x)
	}

	const imageRepoV2 = () => {
		return `http://13.90.210.214/iot-camera-image-small/${serial}/`
	}

	/*
	const imageRepo = () => {
		return `http://13.90.210.214/serials/${serial}/camera${camera}/`
	}



	// For local testing:
	//const imageRepoV2 = () => {
	//	return `http://localhost:3000/iot-camera-image-small/${serial}/`
	//}

	const imageSource = (filename) => {
		return filename

		if (method == 'http') return imageRepoV2() + filename
		else if (method == 'azure-large')
			return `https://gardyniotblob.blob.core.windows.net/iot-camera-image/camera${camera}_${serial}_${filename}`
		else if (method == 'azure-small')
			return `https://gardyniotblobsmall.blob.core.windows.net/iot-camera-image-small/${filename}`
	}
	*/

	const getUserInfo = async (serial) => {
		const url = `/api/user/${serial}`
		const response = await fetch(url)
		const userInfo = await response.json()
		return userInfo
	}
	const getPhotosAzure = async () => {
		let key
		let api
		// console.log("method: " + method)
		if (method == 'azure') {
                api = 'user_photos'

			    // Get user_id from serial.
				const resp = await getUserInfo(serial)
				if (!resp || resp.length === 0) 
				  return
				const userInfo = resp[0]
				key = userInfo.user_id
		}
		else {
			api = 'photos_http'
			key = serial
		}

		let url = `/api/${api}/${key}/${camera}?`
		if (t0)
			url += `t0=${t0}`
		if (t1)
			url += `&t1=${t1}`
		if (segment)
			url += `&segment=${segment}`
		//console.log("url:", url)

		const response = await fetch(url)
		const batch = await response.json()

        if (batch && batch.photos) {
			const user_id = batch.user_id 
			const device_id = batch.device_id
			const url_prefix = batch.url_prefix

			const photos = batch.photos.map((photo) => {
				const date = photo.date
				const hour = photo.hour
				const timestamp = photo.timestamp
				const camera = batch.camera

				return eval(batch.url_template)
			})
			scanPhotos(photos)
			setBatch(batch)
		}
	}

	const getPhotosNginx = async () => {
		const url = `/api/timelapse_http/${serial}/${camera}?`
		if (t0)
		  url += `t0=${t0}`
		if (t1)
		  url += `&t1=${t1}`
		if (segment)
		  url += `&segment=${segment}`

		const photos= []

		// console.log("url: " + url)
		const response = await fetch(url)
		// if (response) {
			const jsonResponse = await response.text()
			// if (jsonResponse) {
				// console.log("jsonResponse: " + jsonResponse)
				const imageArray = JSON.parse(jsonResponse)

				imageArray.forEach( (filename) => {
					const [date, hour, camera, timestamp] = filename.split('_')
					const ngnxFilename = `${date}.${camera}.${timestamp}.jpg`
					photos.push(ngnxFilename)
				})
			//  }

            if (photos)
			  scanPhotos(photos)
			
			//console.log("photos: ", photos)
		// }
	}

	const scanPhotos = (photos) => {
		setPreloadedImages([])
		setPhotos(photos)

		photos.forEach((image_url, i) => {
			const img = new Image()
			img.onload = () => {
				setPreloadedImages((preloadedImages) => [...preloadedImages, image_url])
			}
			// https://gardyniotblobsmall.blob.core.windows.net/iot-camera-image-small/undefined
			img.src = image_url

			// console.log("preload:", img.src)
			// img.src = image_url
		})

		var hours = []
		if (batch.photos)
			batch.photos.map((photo, i) => {
				const hour = photo.hour.substring(0,2)
				hours[hour] = true
			})
		setHours(hours)

		const start = 0
		if (t0 && batch.photos) {
			for (let i = 0; i < batch.photos.length; i++) {
               // const p = parseNgnxPhoto(photos[i])
			   // if (p.ts >= t0) {
			   if (batch.photos[i].timestamp >= t0 ) {
				   start = i
				   break
			   }			
			}

			const end = batch.photos ? batch.photos.length : 0
			const newRange = { start: start, end: end }
			setRange(newRange)
		}
		setIndex(start)
		initSlideshow()
	}

	const initSlideshow = () => {
		let timer = null
		const startSlideShow = () => {
			timer = setInterval(() => {
				nextSlide()
			}, 120)
		}

		if (!timer) startSlideShow()

		return () => clearInterval(timer)
	}

	const nextSlide = () => {
		let range = rangeRef.current
		let photos = photosRef.current
		let hours = hoursRef.current
		let index = indexRef.current
		let stopAt = stopAtRef.current
		let animate = animateRef.current
		let direction = directionRef.current

		if (animate && photos) {
			let inc = direction
			let next
			while (inc < photos.length) {
				const atRightEnd = index + inc > photos.length - 1
				const atLeftEnd = index + inc < 0
				const stopNow = stopAt == index
				if (atRightEnd || atLeftEnd || stopNow) {
					if (layout == 'journal') {
						// For journel slideshows, go back in the reverse direction, forever.
						setDirection(-1 * direction)
						return
					} else {
					    // Stop at the end, do not wrap.
						setAnimate(false)
						return
					}
				}
				next = (index + inc) % photos.length
				if (wrongHour(hours, photos[next]) || next < range.start || next > range.end) {
					inc++
				} else {
					break
				}
			}
			setIndex((index) => next)
		}
	}

	const getDate = (imgsrc) => {
		if ((method == 'http-hide')) {
			const re = /(\d{4}-\d{2}-\d{2})\.\d\.(\d*).jpg/
			const match = imgsrc.match(re)
			const epoch = match[2]

			return epochToTimestamp(epoch)
		}
        const info = parseAzurePhoto(imgsrc)
		// console.log("getDate: ", info)
		// return info.ts * 1000
		return epochToTimestamp(info.date)

		if (!imgsrc) return new Date()
		imgsrc = imgsrc.replace(/.*_/, '').replace(/_.*/, '')
		const epoch = parseInt(imgsrc.replace('.jpg', ''))
		return epochToTimestamp(epoch)
	}

	const getHour = (photo) => {
		return photo.hour
		//const date = new Date(photo.timestamp * 1000)
		//return date.getHours()
	}

	const toggleAnimation = (e) => {
		setStopAt(-1)
		setDirection(1)
		setAnimate((animate) => !animate)
	}

	const wrongHour = (hours, imgsrc) => {
		return false
		const hour = getHour(imgsrc)
		return hours && !hours[hour]
	}

	const toggleHour = (e, hour) => {
		hours[hour] = !hours[hour]
		setHours(hours)
		e.target.checked = hours[hour]
	}

	const prevWeek = (e) => {
		setStopAt(index - 20)
		setDirection(-1)
		setAnimate(true)
	}

	const nextWeek = (e) => {
		setStopAt(index + 20)
		setDirection(1)
		setAnimate(true)
	}

	const play = (e) => {
		if (index == photos.length - 1) setIndex(0)
		setStopAt(-1)
		setDirection(1)
		setAnimate(true)
	}

	const stop = (e) => {
		setAnimate(false)
	}

	const getHiresImageUrl = () => {
		/*
		const img = photos[index]
		const re = /\d{4}-\d{2}-\d{2}\.(\d)\.(\d*).jpg/

		const match = img.match(re)
		const camera = match[1]
		const epoch = match[2]
		*/

		// const camera = batch.photos[index].camera
		const epoch = batch.photos[index].timestamp
		//  : 'https://gardyniotblob.blob.core.windows.net/iot-camera-image/' + image
		const url =
			'https://gardyniotblob.blob.core.windows.net/iot-camera-image/' +
			`camera${camera}_${serial}_${epoch}.jpg`
		setHiresImageUrl(url)
		return url
	}

	const zoomIn = (e) => {
		if (hiresImageUrl == '') getHiresImageUrl()
		else setHiresImageUrl('')
	}

	// Code that runs each re-draw starts here.
	if (!photos || !(photos.length > index))
		return <div className={styles.no_photos}> ... finding azure photos ... </div>

	const imgsrc = photos[index]
	// const date = getDate(photos[index])
	//const dateStr = batch.photos ? batch.photos[index].date : ''
	//const date = new Date(dateStr)

	// console.log("date: ", date)

	//const timestamp = date 
	//  ? date.toISOString().slice(0, 10) + ' ' + date.toISOString().slice(11, 16)
	//  : ''
	
	const timestamp =  batch.photos ? batch.photos[index].date + ' ' + batch.photos[index].hour : ''

	const preloadCount = photos.length - preloadedImages.length
	const preloadCountDisplay = preloadCount > 0 ? preloadCount : ''
	const preloadedImg =
		preloadCount > 0 ? (
			<div className={styles.preloaded_image}>
				<img src={preloadedImages[preloadedImages.length - 1]} />
			</div>
		) : (
			''
		)
	if (preloadCount === 1 && animate === false) {
		setIndex(0)
		setAnimate(true)
	}


	const below_image_style = layout === 'journal' 
	  ? {display:'none'}
	  : {}

	return (
		<>
			<div className={slideshowStyle}>
				<div className={styles.image_holder}>
					<img
					    className={styles.primary_image}
						src={imgsrc}
						onClick={toggleAnimation}
						onMouseMove={mouseMove}
						onTouchMove={touchMove}
					/>

					{preloadedImg}

					<div className={styles.countdown}>{preloadCountDisplay}</div>
					<div className={styles.datetime}>{timestamp}</div>
				</div>

				<div className={styles.below_image} style={below_image_style}>
					<div>
						<TouchBar
							photos={photos}
							index={index}
							setIndex={setIndex}
							wrongHour={wrongHour}
							hours={hours}
							setRange={setRange}
							range={range}
							setAnimate={setAnimate}
							addJournalEntry={addJournalEntry}
							serial={serial}
							camera={camera}
							batch={batch}
						/>
					</div>

					<div className={styles.vcr_controls}>
						<button onClick={prevWeek} title="play backwards a bit">&#9194;</button>
						<button onClick={stop} title="stop animation">&#9209;&#65039;</button>
						<button onClick={play} title="play timelapse">&#9654;&#65039;</button>
						<button onClick={nextWeek} title="play forward a bit">&#9193;</button>
						<button onClick={zoomIn} title="zoom in for more detail">🔎</button>
					</div>

					<div className={styles.datetime}>{timestamp}</div>
					<div className={styles.timelapse_metadata}>
						{serial} camera {camera}
					</div>
					<Slack serial={serial} photo={photos[index]} imageRepoV2={imageRepoV2} />

				</div>


			</div>

			<Zoom hiresImageUrl={hiresImageUrl} setHiresImageUrl={setHiresImageUrl} />
		</>
	)
}

export default Slideshow
