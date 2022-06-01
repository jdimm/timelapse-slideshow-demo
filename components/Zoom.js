import React, { useState, useEffect, useRef } from 'react'
import styles from './Slideshow.module.css'

const Zoom = ({ hiresImageUrl, setHiresImageUrl }) => {
	const [mouseDown, setMouseDown] = useState(false)
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
	const [hiresStyle, setHiresStyle] = useState({ top: 0, left: 0 })

	const onMouseDown = (e) => {
		e.preventDefault()
		setMousePos({
			x: e.clientX - hiresStyle.left,
			y: e.clientY - hiresStyle.top
		})
		setMouseDown(true)
	}

	const onMouseUp = (e) => {
		e.preventDefault()
		setMouseDown(false)
	}

	const onMouseMove = (e) => {
		e.preventDefault()
		if (mouseDown && hiresImageUrl != '') {
			setHiresStyle({
				top: e.clientY - mousePos.y,
				left: e.clientX - mousePos.x
			})
		}
	}

	if (!hiresImageUrl || closed) {
		return null
	}

	return (
		<div className={styles.hires_image}>
			<img
				style={hiresStyle}
				onMouseDown={onMouseDown}
				onMouseUp={onMouseUp}
				onMouseMove={onMouseMove}
				src={hiresImageUrl}
				onMouseOut={onMouseUp}
			/>
			<div className={styles.close_button} onClick={(e) => setHiresImageUrl('')}>
				X
			</div>
		</div>
	)
}

export default Zoom
