import React, {useState,useEffect,useRef} from 'react';
import styles from './Slideshow.module.css'

const HourSelect = ( { hours, toggleHour } ) => {
    return (
      <div className={styles.hourSelect}>
      {
        hours.map( (hour, idx) => {
          return <span key={idx}>
            <input 
              type="checkbox" 
              defaultChecked={hour} 
              onChange={(e) => toggleHour(e,idx)}/>{idx} &nbsp;
          </span>
        })
      }
      </div>
    )
}

const TouchBar = ( {photos, index, setIndex, wrongHour, hours} ) => {
  const onXMove = (w,x) => {
    const pc = x / w
    const newIndex = Math.max(0, Math.floor( (pc * photos.length)) % photos.length)
    setIndex(newIndex)
  }

  const mouseMove = (e) => {
    const x = e.nativeEvent.offsetX 
    const w = e.currentTarget.clientWidth
    onXMove(w,x)
  }

  const touchMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.targetTouches[0].clientX - rect.left;
    const w = e.currentTarget.clientWidth
    onXMove(w,x)
  }

  return (
    <div className={styles.touchBar} onMouseMove={mouseMove} onTouchMove={touchMove}>
      {
        photos.map( (photo, idx) => {
          const skip = wrongHour(hours, photo)
          let color = "black"
          if (skip)
            color = 'white'
          else if (idx <= index)
            color = 'red'

          return (
              <span 
                key={idx}
                style={ {color: color}} 
                className={styles.touchBarCell} >I</span>
            ) 
          })
      }
    </div>
  ) 
}

const Slideshow = ( {serial, camera} ) => {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [photos, setPhotos] = useState([])
  const [preloadedImages, setPreloadedImages] = useState([])
  const [hours, setHours] = useState([])

  const animateRef = useRef(animate)
  const indexRef = useRef(index)

  const imageRepo = () => {
      return `http://13.90.210.214/serials/${serial}/camera${camera}/`
  }

  useEffect(() => {
    // Use a ref to communicate the animate state to the 
    // setInterval in the next useEffect.  This useEffect
    // runs every time.
    animateRef.current = animate
    indexRef.current = index
  })

  useEffect(() => {
    if (!serial)
      return

    getPhotos()
  },[serial]) 

  const getPhotos = () => {
    // Get the listing of files from the serial directory.
    const url = imageRepo()
    console.log("getPhotos", url)

    fetch(url).then(function (response) {
      return response.text();
    }).then(function (html) {
      // Parse nginx directory response.
      const regexp = /href="(.*?.jpg)"/g
      const matches = [... html.matchAll(regexp)]
      const photos = matches.map( (val, idx) => val[1])

      setPhotos(photos)
      startSlideshow(photos)
    }).catch(function (err) {
      console.warn('Something went wrong getting photos.', url, err);
    });
  } 

  const startSlideshow = (photos) => { 
    // Pass photos as param because setPhotos has not yet happened.

    if (!preloadedImages.length && photos) {
      // Preload images.
      var images = photos.map((image_url, i) => {
        const img = new Image()
        img.src = imageRepo() + image_url 
        return img;    
      }) 
      setPreloadedImages(images)

      // Scan for hours. 
      var hours = []
      photos.map((image_url, i) => {
        const hour = getHour(image_url)
        hours[hour] = true
      })
      setHours(hours)
    }

    // Start the slideshow.
    const interval = setInterval(() => { 
        nextSlide(hours, photos)
    }, 120);
    
    return () => clearInterval(interval);
  }

  const nextSlide = (hours, photos) => {
    // Skip unselected hours.
    if (animateRef.current && photos) {
      let inc=1
      let next 
      while(inc < photos.length) {
        next = (indexRef.current + inc) % photos.length
        if (wrongHour(hours, photos[next])) {
          inc++
        } else {
          break
        }
      }
      setIndex( index => next ) 
    }
  }

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
    hours[hour] = !hours[hour]
    setHours(hours)
    e.target.checked = hours[hour]
  }

  if (!photos || ! (photos.length > index))
    return null

  const imgsrc = imageRepo() + photos[index]

  const date = getDate(photos[index])
  const title = date.toLocaleString('en-GB')

  return (
    <div className={styles.slideshow} >
      <img src={imgsrc} onClick={toggleAnimation} />
      <div className={styles.datetime}>{title}</div>
      <HourSelect hours={hours} toggleHour={toggleHour}/>
      <TouchBar 
        photos={photos} 
        index={index} 
        setIndex={setIndex} 
        wrongHour={wrongHour} 
        hours={hours}/>
    </div>
  );
}

export default Slideshow;