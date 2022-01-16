import {useState,useEffect} from 'react';
import sample_photos from '../data/photos';
import styles from './index.module.css'

function Timelapse() {
  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [index2screen, setIndex2screen] = useState(5)
  const [preloaded,setPreloaded] = useState(false)
  const [photos, setPhotos] = useState([])

  // const serial = 'ff2bb085f94680c754072062a61dd5b1'
  const serial = '002e3a4ce5e861657317136a04cb6e90'

  //const url_prefix = 'photos/'
  const url_prefix = `http://13.90.210.214/serials/${serial}/camera1/`


  useEffect(() => {

    const makePhotos = (photos) => { 
      // Map from photo index to x position on progress bar.
      const el = document.getElementById('slideshow_img')
      if (el && photos)
        setIndex2screen(index2screen => 
            (el.width - 50)/ photos.length)
  
      // Preload images.
      if (!preloaded && photos) {
        photos.forEach((image_url, i) => {
          const img = new Image()
          img.src = url_prefix + image_url     
        }) 
        setPreloaded(true)
      }
  
      // Start the slideshow.
      const interval = setInterval(() =>{ 
          if (animate && photos) {
            setIndex( index => (index+1) % photos.length ) 
          }
      }, 120);
      return () => clearInterval(interval);
    }

    const getPhotos = () => {
      fetch(url_prefix).then(function (response) {
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

    //usePhotos(photos)
    getPhotos()

  },[]) 

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
    setAnimate(false)
  }
  const onMouseOut = (e) => {
    setAnimate(true)
  }

  if (!photos || !photos.length)
    return null

  const position = index * index2screen
  const total = photos.length * index2screen
  const rest = total - position
  const styleLeft = {"width": position}
  const styleRight = {"width": rest}

  const imgsrc = url_prefix + photos[index]

  return (
    <div className={styles.timelapse}>
      <img id='slideshow_img' src={imgsrc} />
      <br />
      <div id='progress_bar' className={styles.progress_bar} 
             onMouseMove={onMouseMove}
             onTouchMove={onTouchMove}
             onMouseEnter={onMouseEnter}
             onMouseLeave={onMouseOut}>
          <div className={styles.left_bar} style={styleLeft}/>
          &nbsp;
          <div className={styles.right_bar} style={styleRight} />
      </div>
      <h2><i>Timelapse as Slideshow</i></h2>
    </div>
  );
}

export default Timelapse;