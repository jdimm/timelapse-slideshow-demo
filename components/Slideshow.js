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

const TouchBar = ( {photos, index, setIndex, wrongHour, hours, setRange, range, setAnimate} ) => {
  const onXMove = (w,x) => {
    const pc = x / w
    const newIndex = Math.max(0, Math.floor( (pc * photos.length)) % photos.length)
    if (!wrongHour(hours, photos[newIndex]))
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

  const click = (e) => {
    const r = range
    if (r.start === 0) {
      // First click pick start.
      r.start = index
      setAnimate(false)
    } else if (r.end=== photos.length) {
      // Second click pick end.
      r.end = index
    } else {
      // Third click, reset.
      r.start = 0
      r.end = photos.length
    }
    setRange( r ) 
  }

  return (
    <div className={styles.touchBar} 
      onMouseMove={mouseMove} 
      onTouchMove={touchMove}
      onClick={click}>
      {
        photos.map( (photo, idx) => {
          const skip = wrongHour(hours, photo)
          let color = "black"
          if (idx < range.start || idx >= range.end)
            color = "lightgray"
          else if (skip)
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

const Slideshow = ( {serial, camera, method} ) => {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [photos, setPhotos] = useState([])
  const [preloadedImages, setPreloadedImages] = useState([])
  const [hours, setHours] = useState([])
  const [range, setRange] = useState({})
  const [stopAt, setStopAt] = useState(-1)
  const [direction, setDirection] = useState(1)
  // const [method, setMethod] = useState(_method)

  const animateRef = useRef(animate)
  const indexRef = useRef(index)
  const stopAtRef = useRef(stopAt)
  const directionRef = useRef(direction)


  const onXMove = (w,x) => {
    const pc = x / w
    const newIndex = Math.max(0, Math.floor( (pc * photos.length)) % photos.length)
    if (!wrongHour(hours, photos[newIndex]))
      setIndex(newIndex)
  }

  const mouseMove = (e) => {
    const x = e.nativeEvent.offsetX 
    const w = e.currentTarget.clientWidth
    onXMove(w,x)
  }

  const imageRepo = () => {
      return `http://13.90.210.214/serials/${serial}/camera${camera}/`
  }

  const imageSource = (filename) => {
    // console.log("method:", method)
    // return imageRepo() + filename

    if (method == 'http')
      return imageRepo() + filename
      
    else if (method == 'azure-large')
      return `https://gardyniotblob.blob.core.windows.net/iot-camera-image/camera${camera}_${serial}_${filename}`
    
    else if (method == 'azure-small')
      return `https://gardyniotblob.blob.core.windows.net/iot-camera-image-small/camera${camera}_${serial}_${filename}`

    //
  }

  useEffect(() => {
    // Use a ref to communicate the animate state to the 
    // setInterval in the next useEffect.  This useEffect
    // runs every time.
    animateRef.current = animate
    indexRef.current = index
    stopAtRef.current = stopAt
    directionRef.current = direction
  })

  useEffect(() => {
    if (!serial)
      return

    getPhotos()
  },[serial]) 

  const getPhotos = () => {
    // Get the listing of files from the serial directory.
    const url = imageRepo()
    // console.log("getPhotos", url)

    fetch(url).then(function (response) {
      return response.text();
    }).then(function (html) {
      // Parse nginx directory response.
      const regexp = /href="(.*?.jpg)"/g
      const matches = [... html.matchAll(regexp)]
      const photos = matches.map( (val, idx) => val[1])
      // console.log(photos)

      setPhotos(photos)
      const newRange = {start: 0, end: photos.length}
      setRange(newRange)
      setIndex(photos.length-20)
      initSlideshow(photos, newRange)
    }).catch(function (err) {
      console.warn('Something went wrong getting photos.', url, err);
    });
  } 

  const initSlideshow = (photos, range) => { 
    // Pass photos as param because setPhotos has not yet happened.

    const startSlideShow = () => {
        const interval = setInterval(() => { 
          nextSlide(hours, photos, range)
      }, 120);
    }

    if (!preloadedImages.length && photos) {
      // Preload images.
      var images = photos.map((image_url, i) => {
        const img = new Image()
        // img.src = imageRepo() + image_url 
        img.src = imageSource(image_url)
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

      startSlideShow()
    } else {
      startSlideShow()
    }


    
    return () => clearInterval(interval);
  }

  const nextSlide = (hours, photos, range) => {
    // Skip unselected hours.
    if (animateRef.current && photos) {
      let inc=directionRef.current
      let next 
      while(inc < photos.length) {
        const atRightEnd = (indexRef.current + inc > photos.length - 1)
        const atLeftEnd = (indexRef.current + inc < 0)
        const stopNow = stopAtRef.current == indexRef.current
        // console.log('stopAtRef', stopAtRef.current, indexRef.current)
        if (atRightEnd || atLeftEnd || stopNow) {
          // Stop at the end, do not wrap.
          setAnimate(false)
          return
        }
        next = (indexRef.current + inc) % photos.length
        if (wrongHour(hours, photos[next]) || next < range.start || next > range.end ) {
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
      setStopAt(-1)
      setDirection(1)
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
    if (index == photos.length-1)
      setIndex(0)
    setStopAt(-1)
    setDirection(1)
    setAnimate(true)    
  }

  const stop = (e) => {
    setAnimate(false)
  }

  if (!photos || ! (photos.length > index))
    return null

  const imgsrc = imageSource(photos[index])
  const date = getDate(photos[index])
  const title = date.toLocaleString('en-GB')
 
  const schedule_link = '/schedule/' + serial + '/2022-05-01'
  
  return (
    <div className={styles.slideshow} >
      <img src={imgsrc} onClick={toggleAnimation} onMouseMove={mouseMove}/>
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
        <div className={styles.datetime}>{title}</div>
        <div>
          <button onClick={prevWeek}>&#9194;</button>
          <button onClick={stop}>&#9209;&#65039;</button>
          <button onClick={play}>&#9654;&#65039;</button>
          <button onClick={nextWeek}>&#9193;</button>
        </div>
        <HourSelect hours={hours} toggleHour={toggleHour}/>
        <a href={schedule_link} target="_blank">Schedule and Azure Images</a>
    </div>
  );
}

export default Slideshow;