const { BlobServiceClient } = require('@azure/storage-blob');

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

    const azureFiles = await azureStorage(serial, timestamp_start, timestamp_end)

    res.setHeader('Content-Type', 'application/json');
    res.json(azureFiles)
}