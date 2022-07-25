import * as fs from 'fs';
import { parseNgnxPhoto } from '/util/unpackFilenames.js'


const parseFilename = (filename) => {
    const [date, camera, ts] = filename.split('.')

    const tsDate = new Date(ts * 1000)
    const tsHour = tsDate.getHours() + ':' + tsDate.getMinutes() + ':' + tsDate.getSeconds()
    return `${date}_${tsHour}_${camera}_${ts}`
}

const getLocalFiles = ( (serial, requestedCamera, t0, t1, cutoff, segment) =>{
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

const timelapseHTTP = async (req, res) => {
    const {
		query: { slug, t0, t1, cutoff, segment },
	} = req;

    const serial = slug[0] 
    const camera = slug[1]

    const  serverFiles = getLocalFiles(serial, camera, t0, t1, cutoff, segment)

    res.setHeader('Content-Type', 'application/json');
    res.json(serverFiles)
}

export default timelapseHTTP