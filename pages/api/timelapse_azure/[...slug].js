import { smallImages } from '../../../util/azure'

export default async (req, res) => {
    const {
		query: { slug },
	} = req;

    const serial = slug[0] 
    const camera = slug[1]

    const  serverFiles = await smallImages(serial, camera)

    const regex = /camera(\d)_([^_]*)_([^_]*).jpg/
    const blobList = serverFiles.map ( (file, idx) => {
        //return file
        const match = file.match(regex)
        if (match) {
          const camera = match[1]
          const timestamp = match[3]
          const tsDate = new Date(timestamp * 1000)
          const sDate = tsDate.getFullYear()
          + '-'
          + ('0' + (tsDate.getMonth()+1)).slice(-2)
          + '-'
          + ('0' + tsDate.getDate()).slice(-2)

          const tsHour = tsDate.getHours() + ':' + tsDate.getMinutes() + ':' + tsDate.getSeconds()
          return `${sDate}_${tsHour}_${camera}_${timestamp}`
        }
        return null
    })

    res.setHeader('Content-Type', 'application/json');
    res.json(blobList)
}