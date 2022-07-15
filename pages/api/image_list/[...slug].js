import { bigImages, smallImages, getLocalFiles } from '../../../util/azure'

const imageList = async (req, res) => {
    const {
		query: { slug },
	} = req;

    const serial = slug[0] 
    const timestamp_start = slug[1] 
    const timestamp_end = slug[2]
    const containerName = slug.length > 3 ? slug[3] : 'big'

    /*
       http://localhost:3000/api/azure_list/845f89ee6e4cfe2afd9cfef70a4065d8/1651474800/1651485600
    */

    let serverFiles = []
    if (containerName === 'big') {
      serverFiles = await bigImages(serial, timestamp_start, timestamp_end)
    } else if (containerName === 'small') {
      serverFiles = await smallImages(serial)
    }

    const localFiles = getLocalFiles(serverFiles)

    const response = {serverFiles: serverFiles, localFiles:localFiles}
    res.setHeader('Content-Type', 'application/json');
    res.json(response)
}

export default imageList