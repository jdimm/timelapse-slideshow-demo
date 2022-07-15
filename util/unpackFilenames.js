export const parseAzurePhoto = (image) => {
    const re = /camera(\d)_([^_]*)_([^_]*).jpg/
    const match = image.match(re)
    const camera = match[1]
    const serial = match[2]
    const ts = match[3]
    return {
        camera: camera,
        serial: serial,
        ts: ts
    }
  }

  export const parseNgnxPhoto = (image) => {
    // "2022-04-26.1.1650952293.jpg"
    const p = image.split('.')
    const date = p[0]
    const camera = p[1]
    const ts = p[2]
    return {
        date: date,
        camera: camera,
        ts: ts
    }
  }