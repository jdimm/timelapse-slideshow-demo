import React, {useState,useEffect,useRef} from 'react';
//import sample_photos from '../../data/photos';
import styles from './Slideshow.module.css'


const Slideshow = ( {serial, camera} ) => {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [index2screen, setIndex2screen] = useState(3.2)
  const [photos, setPhotos] = useState([])
  const [preloadedImages, setPreloadedImages] = useState([])
  const animateRef = useRef(animate)

  
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

    const makePhotos = (photos) => { 

      // Preload images.
      if (!preloadedImages.length && photos) {
        var images = photos.map((image_url, i) => {
          const img = new Image()
          img.src = url_prefix() + image_url 
          return img;    
        }) 
        setPreloadedImages(images)
      }
  
      // Start the slideshow.
      const interval = setInterval(() => { 
          if (animateRef.current && photos) {
 
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
        makePhotos(photos)
      }).catch(function (err) {
        console.warn('Something went wrong.', err);
      });
    }  

    if (!serial)
      return

    getPhotos()

  },[serial]) 

  const toggleAnimation = (e) => {
      setAnimate (animate => !animate)
  }

  if (!photos || !photos.length > index)
    return null

  const position = index * index2screen
  const total = photos.length * index2screen
  const rest = total - position
  const styleLeft = {"width": position}
  const styleRight = {"width": rest}

  const imgsrc = url_prefix() + photos[index]
  const date = new Date(parseInt(photos[index].replace(".jpg","")) * 1000)
  const title = date.toLocaleString('en-GB')

  const touchBar = photos.map( (photo, idx) => {
    const style = { color: idx === index ? "red" : "black" }
    return (
      <span key={idx} style={style} className={styles.touchBarCell} onMouseEnter={() => setIndex(idx) }>I</span>
    ) })

  return (
    <div className={styles.slideshow}
      onClick={toggleAnimation}>
      <img id='slideshow_img' src={imgsrc} />
      <br />
      <div id='progress_bar' className={styles.progress_bar}>
          <div id="left_bar" className={styles.left_bar} style={styleLeft}/>
          <div id="middle_bar" className={styles.middle_bar}>&nbsp;</div> 
          <div className={styles.right_bar} style={styleRight} />
          <div className={styles.datetime}>{title}</div>
      </div>
      <div>
      {touchBar}
      </div>
    </div>
  );
}

export default Slideshow;