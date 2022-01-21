import React, {useState,useEffect,useRef} from 'react';
//import sample_photos from '../../data/photos';
import styles from './Slideshow.module.css'

const Slideshow = ( {serial, camera} ) => {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [photos, setPhotos] = useState([])
  const [preloadedImages, setPreloadedImages] = useState([])
  const [hours, setHours] = useState([])
  const animateRef = useRef(animate)
  const indexRef = useRef(index)
  
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
    indexRef.current = index
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

        var h = []
        photos.map((image_url, i) => {
          const hour = getHour(image_url)
          h[hour] = true
        })
        setHours(h)
        }
  
      // Start the slideshow.
      const interval = setInterval(() => { 
          if (animateRef.current && photos) {
            // Skip unselected hours.
            let inc=1
            let idx = indexRef.current
            let next 
            while(inc < photos.length) {
              next = (idx + inc) % photos.length
              if (wrongHour(h, photos[next])) {
                inc++
              } else {
                break
              }
            }
            setIndex( index => next ) 
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
        // Read nginx directory response.
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

  const getDate = (imgsrc) => {
    if (!imgsrc) 
       return new Date() 

    const serial = parseInt(imgsrc.replace(".jpg",""))
    return new Date(serial * 1000)
  }

  const getHour = (imgsrc) => {
    const date = getDate(imgsrc)
    return date.getHours()
  }

  const toggleAnimation = (e) => {
      setAnimate (animate => !animate)
  }

  const wrongHour = (hours, imgsrc) => {
    const hour = getHour(imgsrc)
    return !hours[hour]  
  }

  const toggleHour = (e, hour) => {
    const newHours = hours
    newHours[hour] = !newHours[hour]
    setHours(newHours)
    e.target.checked = newHours[hour]
  }

  if (!photos || ! (photos.length > index))
    return null

  const imgsrc = url_prefix() + photos[index]

  const date = getDate(photos[index])
  const hour = getHour(photos[index])
  const title = hour in hours && hours[hour] 
    ? date.toLocaleString('en-GB')
    : ""
  let datetime =  <div className={styles.datetime}></div> 
  if (title != "")
    datetime = <div className={styles.datetime}>{title}</div> 

  const touchBar = photos.map( (photo, idx) => {
    const style = { color: idx <= index ? "red" : "black" }
    return (
      <span 
        key={idx}
        style={style} 
        className={styles.touchBarCell} 
        onMouseEnter={() => setIndex(idx) }>I</span>
    ) })
  
  const hourSelect = hours.map( (hour, idx) => {
    return <span key={idx}>
       <input 
         type="checkbox" 
         defaultChecked={hour} 
         onChange={(e) => toggleHour(e,idx)}/>{idx} &nbsp;
    </span>
  })

  return (
    <div className={styles.slideshow} >
      <img src={imgsrc} onClick={toggleAnimation} />
      {datetime}
      <div className={styles.hourSelect}>{hourSelect}</div>
      <div className={styles.touchBar}>{touchBar}</div>
    </div>
  );
}

export default Slideshow;