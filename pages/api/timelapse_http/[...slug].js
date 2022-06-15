import * as fs from 'fs';

const parseFilename = (filename) => {
    const parts = filename.split('.')
    const date = parts[0]
    const camera = parts[1]
    const timestamp = parts[2]

    const tsDate = new Date(timestamp * 1000)
    const tsHour = tsDate.getHours() + ':' + tsDate.getMinutes() + ':' + tsDate.getSeconds()
    return `${date}_${tsHour}_${camera}_${timestamp}`

}

const getLocalFiles = ( async (serial, requestedCamera) =>{
    const files = fs.readdirSync(`./iot-camera-image-small/${serial}/`)
    const filtered = files.filter(file => {
        const parts = file.split('.')
        const camera = parts[1]
        console.log("camera: " + camera, " requestedCamera: " + requestedCamera)
        return camera == requestedCamera
    } )


    const extracted = filtered.map ( (file, idx) => {
        return parseFilename(file)
    })
    return extracted
})

export default async (req, res) => {
    const {
		query: { slug },
	} = req;

    const serial = slug[0] 
    const camera = slug[1]

    const  serverFiles = await getLocalFiles(serial, camera)

    res.setHeader('Content-Type', 'application/json');
    res.json(serverFiles)
}