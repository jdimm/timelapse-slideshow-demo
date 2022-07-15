
// import { createPipelineFromOptions } from '@azure/core-http';
// import { time } from 'console';

import * as fs from 'fs';
import fetch from 'node-fetch';
var Jimp = require('jimp');
import { pipeline } from 'stream'

const {Duplex} = require('stream'); // Native Node Module 

function bufferToStream(myBuuffer) {
    let tmp = new Duplex();
    tmp.push(myBuuffer);
    tmp.push(null);
    return tmp;
}

const downloadAzureImage = async (url) => {
    const response = await fetch(url)
    const imageBlob = await response.blob()
    return Buffer.from(await imageBlob.arrayBuffer())
}

async function downscaleBuffer(buffer, path, image_width) {
    const theimg = await Jimp.read(buffer)

    theimg
      .resize(parseInt(image_width), Jimp.AUTO) // resize
      .quality(90) // set JPEG quality
      .write(path) 
}

const azureDownscale = async (req, res) => {
    const {
		query: { slug },
	} = req;

    const serial = slug[0] 
    const camera = slug[1] 
    const timestamp = slug[2] 
    const image_width = slug[3]

    // http://13.90.210.214/serials/85df8546a995dd7772a230f03978cbc8/camera2/1649607694.jpg
    const path = `./public/serials/${serial}/camera${camera}/${timestamp}.jpg`

    //const azureUrl = 'https://gardyniotblob.blob.core.windows.net/iot-camera-image/camera1_c2c5916b17dff1437dbc0ea761d9651c_1647130896.jpg'
    const url = `https://gardyniotblob.blob.core.windows.net/iot-camera-image/camera${camera}_${serial}_${timestamp}.jpg`

    let buffer
    if (fs.existsSync(path)) {
        console.log('using local file ', path)
        buffer = fs.readFileSync(path)
    } else {
       buffer = await downloadAzureImage(url)
       await downscaleBuffer(buffer, path, image_width)
    }

   //  await downscaleUrl(url, image_width)

    //fs.writeFileSync('response.jpg', b)
    //const imageStream = fs.createReadStream(`response.jpg`)

    const imageStream = bufferToStream(buffer);
    res.setHeader('Content-Type', 'image/jpg')
    pipeline(imageStream, res, (error) => {
      if (error) console.error(error)
    })

    // res.setHeader('Content-Type', 'application/json');
    // res.json({response: 'ok'});
    
};

export default azureDownscale