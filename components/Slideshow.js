import React, { useState, useEffect, useRef } from 'react'
import styles from './Slideshow.module.css'
import { epochToTimestamp, timestampToEpoch } from '../util/timestamp'
import Zoom from './Zoom'
import TouchBar from './TouchBar'
import Slack from './Slack'

let gInterval = null

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

const Slideshow = ({ serial, camera }) => {
	const [index, setIndex] = useState(0)
	const [animate, setAnimate] = useState(false)
	const [photos, setPhotos] = useState([])
	const [preloadedImages, setPreloadedImages] = useState([])
	const [hours, setHours] = useState([])
	const [range, setRange] = useState({})
	const [stopAt, setStopAt] = useState(-1)
	const [direction, setDirection] = useState(1)
	const [slideshowStyle, setSlideshowStyle] = useState(styles.slideshow)
	const [hiresImageUrl, setHiresImageUrl] = useState('')

	const animateRef = useRef(animate)
	const indexRef = useRef(index)
	const stopAtRef = useRef(stopAt)
	const directionRef = useRef(direction)
	const rangeRef = useRef(range)
	const photosRef = useRef(photos)
	const hoursRef = useRef(hours)

	const method = 'http'

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

		if (method == 'azure-small') {
			getPhotosAzure()
		} else if (method == 'http') {
			getPhotosNginx()
		}
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

	const imageRepo = () => {
		return `http://13.90.210.214/serials/${serial}/camera${camera}/`
	}

	const imageRepoV2 = () => {
		return `http://13.90.210.214/iot-camera-image-small/${serial}/`
	}

	const imageSource = (filename) => {
		// console.log("method:", method)
		// return imageRepo() + filename

		if (method == 'http') return imageRepoV2() + filename
		else if (method == 'azure-large')
			return `https://gardyniotblob.blob.core.windows.net/iot-camera-image/camera${camera}_${serial}_${filename}`
		else if (method == 'azure-small')
			return `https://gardyniotblobsmall.blob.core.windows.net/iot-camera-image-small/${filename}`
	}

	const getPhotosAzure = async () => {
		const startTS = 958053498 // 2000
		const endTS = 4082191098 // 2099

		const url = `/api/image_list/${serial}/${startTS}/${endTS}/small`
		console.log('url:', url)
		const response = await fetch(url)
		const jsonResponse = await response.json()
		const photosBoth = jsonResponse.serverFiles

		const photos = photosBoth.filter((photo) => {
			const good = photo.startsWith('camera' + camera)
			return good
		})

		scanPhotos(photos)
	}

	const getPhotosNginx = () => {
		// Get the listing of files from the serial directory.
		const url = imageRepoV2()

		fetch(url)
			.then(function (response) {
				return response.text()
			})
			.then(function (html) {
				// Parse nginx directory response.
				// console.log(html)
				const regexp = /href="(.*?.jpg)"/g
				const matches = [...html.matchAll(regexp)]
				const photosBoth = matches.map((val, idx) => val[1])

				const photos = photosBoth.filter((photo) => {
					const re = /\.(\d).(\d*).jpg/
					const match = photo.match(re)
					const good = match && match[1] == camera
					return good
				})

				// console.log(photos)
				scanPhotos(photos)
			})
			.catch(function (err) {
				console.warn('Something went wrong getting photos.', url, err)
			})
	}

	const scanPhotos = (photos) => {
		setPreloadedImages([])
		setPhotos(photos)

		console.log('preloading images, num photos:', photos.length)

		photos.forEach((image_url, i) => {
			const img = new Image()
			img.onload = () => {
				setPreloadedImages((preloadedImages) => [...preloadedImages, image_url])
			}
			img.src = imageSource(image_url)
		})

		var hours = []
		photos.map((image_url, i) => {
			const hour = getHour(image_url)
			hours[hour] = true
		})
		setHours(hours)

		const newRange = { start: 0, end: photos.length }
		// console.log("newRange:", newRange)
		setRange(newRange)
		setIndex(0)
		initSlideshow()
	}

	const initSlideshow = () => {
		const startSlideShow = () => {
			gInterval = setInterval(() => {
				nextSlide()
			}, 120)
		}

		if (!gInterval) startSlideShow()

		return () => clearInterval(gInterval)
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
			// console.log('inc:', inc, ' range:', range, ' stopAt:', stopAt)
			let next
			while (inc < photos.length) {
				const atRightEnd = index + inc > photos.length - 1
				// if (atRightEnd)
				// console.log("index:", index, " photos.length:", photos.length)
				const atLeftEnd = index + inc < 0
				const stopNow = stopAt == index
				// console.log('stopAtRef', stopAtRef.current, indexRef.current)
				if (atRightEnd || atLeftEnd || stopNow) {
					// Stop at the end, do not wrap.
					// console.log('stop at end, atRightEnd:', atRightEnd, ' atLeftEnd:', atLeftEnd, ' stopNow:', stopNow)
					setAnimate(false)
					return
				}
				next = (index + inc) % photos.length
				// console.log('next:', next, 'range.end:', range.end)
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
		if ((method = 'http')) {
			const re = /(\d{4}-\d{2}-\d{2})\.\d\.(\d*).jpg/
			const match = imgsrc.match(re)
			const epoch = match[2]

			return epochToTimestamp(epoch)
		}

		if (!imgsrc) return new Date()
		imgsrc = imgsrc.replace(/.*_/, '').replace(/_.*/, '')
		const epoch = parseInt(imgsrc.replace('.jpg', ''))
		return epochToTimestamp(epoch)
	}

	const getHour = (imgsrc) => {
		const date = getDate(imgsrc)
		return date.getHours()
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
		const img = photos[index]
		const re = /\d{4}-\d{2}-\d{2}\.(\d)\.(\d*).jpg/
		const match = img.match(re)
		const camera = match[1]
		const epoch = match[2]
		//  : 'https://gardyniotblob.blob.core.windows.net/iot-camera-image/' + image
		const url =
			'https://gardyniotblob.blob.core.windows.net/iot-camera-image/' +
			`camera${camera}_${serial}_${epoch}.jpg`
		setHiresImageUrl(url)
		console.log('hiresImageUrl:', url)
		return url
	}

	const zoomIn = (e) => {
		if (hiresImageUrl == '') getHiresImageUrl()
		else setHiresImageUrl('')
	}

	// Code that runs each re-draw starts here.
	if (!photos || !(photos.length > index))
		return <div className={styles.no_photos}> ... finding azure photos ... </div>

	const imgsrc = imageSource(photos[index])
	const date = getDate(photos[index])

	const title = date.toISOString().slice(0, 10) + ' ' + date.toISOString().slice(11, 16)

	const preloadCount = photos.length - preloadedImages.length
	const preloadCountDisplay = preloadCount > 0 ? preloadCount : ''
	const preloadedImg =
		preloadCount > 0 ? (
			<div className={styles.preloaded_image}>
				<img src={imageSource(preloadedImages[preloadedImages.length - 1])} />
			</div>
		) : (
			''
		)
	if (preloadCount === 1 && animate === false) {
		setIndex(0)
		setAnimate(true)
	}

	return (
		<>
			<div className={slideshowStyle}>
				<div className={styles.image_holder}>
					<img
						src={imgsrc}
						onClick={toggleAnimation}
						onMouseMove={mouseMove}
						onTouchMove={touchMove}
					/>

					{preloadedImg}

					<div className={styles.countdown}>{preloadCountDisplay}</div>
				</div>

				<div className={styles.below_image}>
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
						/>
					</div>

					<div className={styles.vcr_controls}>
						<button onClick={prevWeek} title="play backwards a bit">&#9194;</button>
						<button onClick={stop} title="stop animation">&#9209;&#65039;</button>
						<button onClick={play} title="play timelapse">&#9654;&#65039;</button>
						<button onClick={nextWeek} title="play forward a bit">&#9193;</button>
						<button onClick={zoomIn} title="zoom in for more detail">🔎</button>
					</div>

					<div className={styles.datetime}>{title}</div>
					<div className={styles.timelapse_metadata}>
						{serial} camera {camera}
					</div>
				</div>

				<Slack serial={serial} photo={photos[index]} imageRepoV2={imageRepoV2} />

			</div>

			<Zoom hiresImageUrl={hiresImageUrl} setHiresImageUrl={setHiresImageUrl} />
		</>
	)
}

export default Slideshow
