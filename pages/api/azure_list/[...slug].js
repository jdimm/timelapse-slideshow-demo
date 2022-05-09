const { BlobServiceClient } = require('@azure/storage-blob');

function sort_unique(arr) {
  if (arr.length === 0) return arr;
  arr = arr.sort(function (a, b) { return a*1 - b*1; });
  var ret = [arr[0]];
  for (var i = 1; i < arr.length; i++) { //Start loop at 1: arr[0] can never be a duplicate
    if (arr[i-1] !== arr[i]) {
      ret.push(arr[i]);
    }
  }
  return ret;
}

const azureList = async (serial, ts_start, ts_end) => {
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING_IOT;
  
  if (!AZURE_STORAGE_CONNECTION_STRING) {
    throw Error("Azure Storage Connection string not found");
  }

  const blobServiceClient = BlobServiceClient.fromConnectionString(
    AZURE_STORAGE_CONNECTION_STRING
  );

  const containerName = 'iot-camera-image'
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobList = []
  const ts_s5 = ts_start.toString().substring(0,5)
  const ts_e5 = ts_end.toString().substring(0,5)

  async function listBlobsCamera (timestamp_start, camera) {
    const listOptions = {
      includeMetadata: true,
      includeSnapshots: false,
      includeTags: true,
      includeVersions: false,
      prefix: `camera${camera}_${serial}_${timestamp_start}`
      // prefix: 'camera1_85df8546a995dd7772a230f03978cbc8_16492'
    }

   for await (const blob of containerClient.listBlobsFlat(listOptions)) {
      // console.log('blob: ' + blob.name)
      const re = new RegExp('[^_]*_[^_]*_([^_]*).jpg')
      const match = blob.name.match(re)
      if (match) {
        const ts = match[1]
        if (ts >= ts_start && ts <= ts_end) {
          blobList.push(blob.name)
        }
      }
    }
  }




  await listBlobsCamera(ts_s5, '1')
  await listBlobsCamera(ts_e5, '1')
  await listBlobsCamera(ts_s5, '2')
  await listBlobsCamera(ts_e5, '2')

  return blobList
}

const azureStorage = async (serial, ts_start, ts_end) => {
    const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING_IOT;
  
    if (!AZURE_STORAGE_CONNECTION_STRING) {
      throw Error("Azure Storage Connection string not found");
    }
  
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      AZURE_STORAGE_CONNECTION_STRING
    );

    var query = `"deviceid"='${serial}' and 
    "timestamp">\'${ts_start}\' 
    and "timestamp"<\'${ts_end}\'`
  
    console.log(query)
    const fromTime = new Date(ts_start * 1000)
    const toTime = new Date(ts_end * 1000)
    console.log('fromTime: ' + fromTime)
    console.log('toTime: ' + toTime)
  
    const blobList = []
    for await (const blob of blobServiceClient.findBlobsByTags(query)) {
        blobList.push(blob.name)
    }

    return blobList
  
  }

export default async (req, res) => {
    const {
		query: { slug },
	} = req;

    const serial = slug[0] 
    const timestamp_start = slug[1] 
    const timestamp_end = slug[2]

    /*
       http://localhost:3000/api/azure_list/845f89ee6e4cfe2afd9cfef70a4065d8/1651474800/1651485600
    */

    const azureFiles = await azureList(serial, timestamp_start, timestamp_end)

    res.setHeader('Content-Type', 'application/json');
    res.json(azureFiles)
}