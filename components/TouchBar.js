
import styles from './Slideshow.module.css'

const TouchBar = ({ photos, index, setIndex, wrongHour, hours, setRange, range, setAnimate }) => {
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
		//setRange( r )
	}


	return (
		<div className={styles.touchBar}>
			{photos.map((photo, idx) => {
				const skip = wrongHour(hours, photo)
				let color = 'black'
				if (idx < range.start || idx >= range.end) color = 'lightgray'
				else if (skip) color = 'white'
				else if (idx <= index) color = 'red'

				return (
					<span
						key={idx}
						style={{ color: color }}
						className={styles.touchBarCell}
						onMouseEnter={(e) => setIndex(idx)}
					>
						I
					</span>
				)
			})}
		</div>
	)
}

export default TouchBar