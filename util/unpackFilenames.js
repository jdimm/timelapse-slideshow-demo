export const parseAzurePhoto = (image) => {
    // const re = /camera(\d)_([^_]*)_([^_]*).jpg/
    const re = /(\d*)\/(\d)\/(\d*)\/([^\/]*)\.(\d*)\.([^\.]*)\.jpg/
    const match = image.match(re)
    if (!match) {
      console.log("no match in parseAzurePhoto, image:", image, " match:", match)
      return null
    }

    const [inputString, user_id, camera, device_id, date, timestamp, serial] = match

    const d = new Date(timestamp * 1000)
    const hour = 
      d.getHours().toString().padStart(2, '0')
      + ':' + d.getMinutes().toString().padStart(2, '0')
      + ':' + d.getSeconds().toString().padStart(2, '0')

    // console.log("match:", match)

    return {
        user_id: user_id,
        device_id: device_id,
        camera: camera,
        date: date,
        timestamp: timestamp,
        serial: serial,
        hour: hour
    }
  }

  export const parseNgnxPhoto = (image) => {
    // "2022-04-26.1.1650952293.jpg"
    const p = image.split('.')
    const [date, camera, timestamp] = p

//    const date = p[0]
//    const camera = p[1]
//    const ts = p[2]
    return {
        date: date,
        camera: camera,
        timestamp: timestamp
    }
  }

  