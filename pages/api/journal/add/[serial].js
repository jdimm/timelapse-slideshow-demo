import {useRouter} from 'next/router'
import fs from 'fs'

const AddJournal = (req, res) => {
  const { serial, entry } = JSON.parse(req.body)
  console.log(`serial: ${serial}, entry: ${JSON.stringify(entry)}`)
  
  const filename = `./journals/${serial}.json`
  const journal = fs.existsSync(filename) 
    ? JSON.parse(fs.readFileSync(filename)) 
    : []
  
  const newJournal = [...journal, entry]
  console.log("AddJournal newJournal: " + JSON.stringify(newJournal))
  
  fs.writeFileSync(filename, JSON.stringify(newJournal))  

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({result: 'success'})
}

export default AddJournal
