import { smallImages } from '/util/azure'
import { parseAzurePhoto } from '/util/unpackFilenames'
import { getUserInfo } from '/util/db'

const getAzureFiles = async (serial, camera, t0, t1, cutoff, segment) => {
  const userInfo = await getUserInfo(serial)
  const batchInfo = {
    user_id: userInfo[0].user_id,
    device_id: userInfo[0].device_id,
    url_prefix: 'https://gardyniotblobsmall.blob.core.windows.net/iot-camera-image-small',
    url_template: '`${url_prefix}/${user_id}/${camera}/${device_id}/${date}.${timestamp}.${serial}.jpg`',
    camera: camera,
    photos: []
  }

  const files = await smallImages(batchInfo['user_id'], camera)
  files.forEach(file => {
    const photo = parseAzurePhoto(file)
    if (photo && (!t0 || photo.timestamp >= t0) && (!t1 || photo.timestamp <= t1)) {
      batchInfo.photos.push({
        date: photo.date,
        hour: photo.hour,
        timestamp: photo.timestamp
      })
    }
  })

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

const getPhotos = async (req, res) => {
  const {
  query: { slug, t0, t1, cutoff, segment },
} = req;

  const serial = slug[0] 
  const camera = slug[1]

  const  serverFiles = await getAzureFiles(serial, camera, t0, t1, cutoff, segment)

  res.setHeader('Content-Type', 'application/json');
  res.json(serverFiles)
}

export default getPhotos
