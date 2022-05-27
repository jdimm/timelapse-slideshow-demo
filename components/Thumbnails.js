
import thumbnails from '../data/thumbnails'
import styles from './Slideshow.module.css'

const Thumbnails = ( {} ) => {
   const html = thumbnails.map ( (item, idx) => {
       const h = <a title={item.title} href={item.url}><img className={styles.thumbnails} src={"/screenshots/" + item.image} /></a>
       return h
   })

   return html
}

export default Thumbnails