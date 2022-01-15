import {useState,useEffect} from 'react';
import slides from '../data/slides';
import styles from './index.module.css'

function Timelapse() {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [index2screen, setIndex2screen] = useState(5)
  const [preloaded,setPreloaded] = useState(false)

  useEffect(() => {
    const el = document.getElementById('slideshow_img')
    setIndex2screen((el.width -50)/ slides.length)

    if (!preloaded) {
      slides.forEach((image_url, i) => {
        const img = new Image()
        img.src = "photos/" + image_url     
      }) 
      setPreloaded(true)
    }

    const interval = setInterval(function() { 
        if (animate)
          setIndex( (index+1) % slides.length ) 
    }, 120);
    return () => clearInterval(interval);
  })  

  const scrub = (clientX) => {
    const el = document.getElementById('progress_bar')
    const mousePos = clientX - el.offsetLeft
    const newIndex = Math.max(0, parseInt(mousePos / index2screen)) % slides.length
    setIndex( newIndex)
  }

  const onTouchMove = (e) => {
     scrub(e.touches[0].clientX)
  }

  const onMouseMove = (e) => {
    scrub(e.clientX)
  }

  const onMouseEnter = (e) => {
    setAnimate(false)
  }
  const onMouseOut = (e) => {
    setAnimate(true)
  }

  const position = index * index2screen
  const total = slides.length * index2screen
  const rest = total - position
  const styleLeft = {"width": position}
  const styleRight = {"width": rest}

  return (
    <div className={styles.timelapse}>
    <meta name="viewport" content="width=device-width, initial-scale=.5, maximum-scale=8.0, minimum-scale=.25, user-scalable=yes"/>
      <h1>Timelapse as Slideshow</h1>
      <img id='slideshow_img' src={'photos/' + slides[index]} />
      <br />
      <div id='progress_bar' className={styles.progress_bar} 
             onMouseMove={onMouseMove}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseOut}
             onTouchMove={onTouchMove}>
          <div className={styles.left_bar} style={styleLeft}/>
          &nbsp;
          <div className={styles.right_bar} style={styleRight} />
      </div>

    </div>
  );
}

export default Timelapse;