
import thumbnails from '../data/thumbnails'
import styles from './Slideshow.module.css'

const Thumbnails = ( {} ) => {
   const html = thumbnails.map ( (item, idx) => {

       const h = <a title={item.title} href={item.url}><img alt={item.title} src={"/screenshots/" + item.image} /></a>
       return <div key={idx} className={styles.thumbnails}>
           {h}
           {item.title}
       </div>
   })

   return html
}

export default Thumbnails