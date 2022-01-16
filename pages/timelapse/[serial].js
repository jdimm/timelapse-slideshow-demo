import React, {useState,useEffect,useRef} from 'react';
//import sample_photos from '../../data/photos';
import styles from '../index.module.css'
import {useRouter} from 'next/router'

function Timelapse() {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [index2screen, setIndex2screen] = useState(5)
  const [preloaded,setPreloaded] = useState(false)
  const [photos, setPhotos] = useState([])

  const animateRef = React.useRef(animate)

  const router = useRouter()
  const { serial, camera } = router.query
  console.log (camera)

//  console.log("render", animate)


  const getSerial = () => {
    return serial // '004b19672e6185483aca7956e0995d85'
 }

  const url_prefix = () => {
      return `http://13.90.210.214/serials/${getSerial()}/camera${camera}/`
  }

  useEffect(() => {
    // Use a ref to communicate the animate state to the 
    // setInterval in the next useEffect.  This useEffect
    // runs every time.
    animateRef.current = animate
})

  useEffect(() => {

    const usePhotos = (photos) => { 
      // Map from photo index to x position on progress bar.
        setIndex2screen(index2screen => 
            window.innerWidth * 0.35 / photos.length)
  
      // Preload images.
      if (!preloaded && photos) {
        photos.forEach((image_url, i) => {
          const img = new Image()
          img.src = url_prefix() + image_url     
        }) 
        setPreloaded(true)
      }
  
      // Start the slideshow.
      const interval = setInterval(() => { 
          // console.log("setInterval", animateRef.current)
          if (animateRef.current && photos) {
 
            // const newIndex = (index+1) % photos.length
            setIndex( index => (index+1) % photos.length ) 
          }
      }, 120);
      return () => clearInterval(interval);
    }

    const getPhotos = () => {
      const url = url_prefix()
      console.log("getPhotos", url)
      fetch(url).then(function (response) {
        return response.text();
      }).then(function (html) {
        const regexp = /href="(.*?.jpg)"/g
        const matches = [... html.matchAll(regexp)]
        const photos = matches.map( (val, idx) => val[1])
        setPhotos(photos)
        usePhotos(photos)
      }).catch(function (err) {
        console.warn('Something went wrong.', err);
      });
    }  

    if (!serial)
      return

    //usePhotos(photos)
    getPhotos()

  },[serial]) 

  const scrub = (clientX) => {
    const el = document.getElementById('progress_bar')
    const mousePos = clientX - el.offsetLeft
    const newIndex = Math.max(0, parseInt(mousePos / index2screen)) % photos.length
    setIndex( newIndex)
  }

  const onTouchMove = (e) => {
     scrub(e.touches[0].clientX)
  }
  const onMouseMove = (e) => {
    scrub(e.clientX)
  }

  const onMouseEnter = (e) => {
    setAnimate(animate => false)
    //e.preventDefault()
    // console.log("mouseEnter", animate)
  }
  const onMouseLeave = (e) => {
    setAnimate(animate => true)
    // e.preventDefault()
    // console.log("mouseLeave", animate)
  } 
  const toggleAnimation = (e) => {
      setAnimate (animate => !animate)
      // console.log('toggleAnimation', animate)
  }

  if (!photos || !photos.length)
    return null

  const position = index * index2screen
  const total = photos.length * index2screen
  const rest = total - position
  const styleLeft = {"width": position}
  const styleRight = {"width": rest}

  const imgsrc = url_prefix() + photos[index]

  return (
    <div className={styles.timelapse}
      onClick={toggleAnimation}>
      <img id='slideshow_img' src={imgsrc} />
      <br />
      <div id='progress_bar' className={styles.progress_bar} 
             onMouseMove={onMouseMove}
             onTouchMove={onTouchMove}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseLeave}>
          <div className={styles.left_bar} style={styleLeft}/>
          &nbsp;
          <div className={styles.right_bar} style={styleRight} />
      </div>
      <h2><i>Timelapse as Slideshow</i></h2>
    </div>
  );
}

export default Timelapse;