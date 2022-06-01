import React, { useState } from 'react'
import styles from './Slideshow.module.css'

const Slack = ({ serial, photo, imageRepoV2 }) => {
	const [slackMessage, setSlackMessage] = useState('')
    const [posted, setPosted] = useState('')

	const slackMessageChanged = (e) => {
		setSlackMessage(e.target.value)
	}

	const postToSlack = async (e) => {
		e.preventDefault()
		// const imgUrl = encodeURIComponent(imageRepoV2() + photos[index])
		const imgUrl = imageRepoV2() + photo

		// const url = `/api/slack/${serial}/${imgUrl}`
		const url = '/api/slack/'

		const data = { imgUrl: imgUrl, serial: serial, message: slackMessage }
		const options = {
			method: 'POST',
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			}
		}
		// console.log(options)
		const response = await fetch(url, options)
		const jsonResponse = await response.text()
		console.log(jsonResponse)

        setSlackMessage('')
        setPosted('posted!')
        setTimeout (() => setPosted(''), 3000)

		// alert('posted to slack')
	}

	const slackButtonStyle =
		slackMessage.length > 0 ? styles.slack_button_active : styles.slack_button_inactive

	const disableSlackButton = slackMessage.length === 0

	return (
		<div className={styles.post_to_slack}>
			<div>
				<i>
					Find an interesting one? Post it to Slack and tell us why:
				</i>
			</div>

            <div className={styles.slack_form}>
			   <textarea type='text' size='50' onChange={slackMessageChanged} value={slackMessage}/>

				<button
					className={slackButtonStyle}
					onClick={postToSlack}
					disabled={disableSlackButton}
				></button>
                <div>{posted}</div>
            </div>
		</div>
	)
}

export default Slack
