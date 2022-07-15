
import { createPipelineFromOptions } from '@azure/core-http';
import { time } from 'console';
import * as fs from 'fs';
// import { colorDiff } from 'jimp';
import fetch from 'node-fetch';
var Jimp = require('jimp');
import { pipeline } from 'stream'
import schedule from '../../../data/schedule'

import getSchedule from '../../../util/schedule'
const { BlobServiceClient } = require('@azure/storage-blob');
//import connection from '../../../util/mysql'

const azureStorage = async (ts_start, ts_end) => {
  const AZURE_STORAGE_CONNECTION_STRING =
  process.env.AZURE_STORAGE_CONNECTION_STRING_IOT;

  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error("Azure Storage Connection string not found");
  }

  // Create the BlobServiceClient object which will be used to create a container client
  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  console.log("\nListing blobs...");

  const containerName = 'iot-camera-image'
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const serial = '845f89ee6e4cfe2afd9cfef70a4065d8'
  // const serial = '61ee6063e923f05eb2afffe7a5c6ba92'
  var query = `"deviceid"='${serial}'
  and 
  "timestamp">\'${ts_start}\' 
  and "timestamp"<\'${ts_end}\'`

  console.log(query)
  const fromTime = new Date(ts_start * 1000)
  const toTime = new Date(ts_end * 1000)
  console.log('fromTime: ' + fromTime)
  console.log('toTime: ' + toTime)

  let i = 1;
  for await (const blob of blobServiceClient.findBlobsByTags(query)) {
    console.log(blob.name);
  }

}


async function oldloadPic(url, image_width) {

    const options = {
        method: "GET"
    }

    let response = await fetch(url, options)
    if (response.status === 200) {
        const imageBlob = await response.blob()
        const b = Buffer.from(await imageBlob.arrayBuffer())
        const type = 'image/jpeg'
        const theimg = await Jimp.read(b)

        console.log('resizing image')

        theimg
        .resize(parseInt(image_width), Jimp.AUTO) // resize
        .quality(60) // set JPEG quality
        
        console.log('writing to disk')
        theimg.write('response_small.jpg') 
    }

}

async function loadPic(url, image_width) {

        const theimg = await Jimp.read(url)

        console.log('resizing image')
        theimg
              .resize(parseInt(image_width), Jimp.AUTO) // resize
              .quality(60) // set JPEG quality
              .write('response_small.jpg')
}



const azureDownscalev0 = async (req, res) => {
    const {
		query: { slug },
	} = req;

    const serial = slug[0] 
    const camera = slug[1] 
    const timestamp = slug[2] 
    const image_width = slug[3]

    //const azureUrl = 'https://gardyniotblob.blob.core.windows.net/iot-camera-image/camera1_c2c5916b17dff1437dbc0ea761d9651c_1647130896.jpg'
    const azureUrl = `https://gardyniotblob.blob.core.windows.net/iot-camera-image/camera${camera}_${serial}_${timestamp}.jpg`


    loadPic(azureUrl, image_width)

    const device_id=50
    const day='2022-02-01'
    const lightonToday = await getSchedule(device_id, day)
    console.log('lightonToday: ', lightonToday)


    console.log('writing output to response')

    res.setHeader('Content-Type', 'image/jpg')
    const imageStream = fs.createReadStream(`response_small.jpg`)
    pipeline(imageStream, res, (error) => {
      if (error) console.error(error)
    })
};

export default azureDownscalev0