import * as fs from 'fs';
import { parseNgnxPhoto } from '/util/unpackFilenames.js'
import { getUserInfo } from '/util/db'


const parseFilename = (filename) => {
    const [date, camera, timestamp] = filename.split('.')

    const tsDate = new Date(timestamp * 1000)
    const tsHour = tsDate.getHours() + ':' + tsDate.getMinutes() + ':' + tsDate.getSeconds()
    return {
        date: date,
        camera: camera,
        timestamp: timestamp,
        hour: tsHour
    }
    // }`${date}_${tsHour}_${camera}_${timestamp}`
}

const oldgetLocalFiles = ( (serial, requestedCamera, t0, t1, cutoff, segment) =>{
    const files = fs.readdirSync(`./iot-camera-image-small/${serial}/`)
    const filtered = files.filter( file => {
       const   [ date, camera, ts ] = file.split('.')
        
        // console.log("camera: " + camera, " requestedCamera: " + requestedCamera)
        return camera == requestedCamera 
          && (!t0 || ts >= t0) 
          && (!t1 || ts <= t1)
    } )

    // console.log("filtered: " + filtered)

    if (!cutoff) 
       cutoff = 180

    if (!segment)
        segment = 'last'

    const extracted = []
    filtered.forEach ( (file, idx) => {
        if ( (segment == 'first' && idx < cutoff) 
          || (segment == 'last' && idx >= filtered.length - cutoff)
          || (segment == 'all'))
          extracted.push(parseFilename (file))
    })

    // console.log("extracted: " + extracted)
    return extracted
})


const getLocalFiles = async (serial, camera, t0, t1, cutoff, segment) => {
    const userInfo = await getUserInfo(serial)
    const batchInfo = {
      user_id: userInfo[0].user_id,
      device_id: userInfo[0].device_id,
      url_prefix: 'http://13.90.210.214/iot-camera-image-small',
      url_template: '`${url_prefix}/${serial}/${date}.${camera}.${timestamp}.jpg`',
      camera: camera,
      photos: []
    }
  
    // const files = await smallImages(serial, camera)
    const files = fs.readdirSync(`./iot-camera-image-small/${serial}/`)

    files.forEach(file => {
      const photo = parseFilename(file)
      // console.log(photo)
      if (photo 
          && (!t0 || photo.timestamp >= t0) && (!t1 || photo.timestamp <= t1)
          && (photo.camera == camera)) {
        batchInfo.photos.push({
          date: photo.date,
          hour: photo.hour,
          timestamp: photo.timestamp
        })
      }
    })

    // console.log('batchInfo:', batchInfo)
  
    if (!cutoff) 
       cutoff = 180
  
    if (!segment)
        segment = 'last'
    
    const len = batchInfo.photos.length
    batchInfo.photos = batchInfo.photos.filter ( (info, idx) => {
        return  (segment == 'first' && idx < cutoff) 
          || (segment == 'last' && idx >= len - cutoff)
          || (segment == 'all')
    })
  
    return batchInfo
  }

const timelapseHTTP = async (req, res) => {
    const {
		query: { slug, t0, t1, cutoff, segment },
	} = req;

    const serial = slug[0] 
    const camera = slug[1]

    const  serverFiles = await getLocalFiles(serial, camera, t0, t1, cutoff, segment)
    console.log('serverFiles:', serverFiles)

    res.setHeader('Content-Type', 'application/json');
    res.json(JSON.stringify(serverFiles))
}

export default timelapseHTTP