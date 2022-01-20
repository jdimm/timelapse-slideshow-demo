// import React from 'react';
import styles from './Video.module.css'

const Video = ({serial, camera} ) => {
    const src = `https://gardynappprod.blob.core.windows.net/timelapse-staging/videos/${serial}/camera0${camera}.mp4`
    return (
        <div className={styles.video_div}>
            <video controls autoPlay>
            <source src={src} type="video/mp4"/>
                Sorry, your browser does not support embedded videos.
            </video>

        </div>
  )
}

export default Video;
