import {useRouter} from 'next/router'
import fs from 'fs'

const AddJournal = (req, res) => {
  //console.log("AddJournal body:", req.body)
  //let body = req.body.replace('"', '\\"').replace("'", '"')
  //const { id, entry } = JSON.parse(body)
 let id 
 let entry
 if (req.body.hasOwnProperty('id')) {
    id = req.body.id
    entry = req.body.entry
 } else {
    const b = JSON.parse(req.body)
    id = b.id
    entry = b.entry
 }
  //  const {id, entry} = JSON.parse(req.body)
  console.log(`id: ${id}, entry: ${JSON.stringify(entry)}`)
  
  const filename = `./journals/${id}.json`
  const journal = fs.existsSync(filename) 
    ? JSON.parse(fs.readFileSync(filename)) 
    : []
  
  const newJournal = [...journal, entry]
  console.log("AddJournal newJournal: " + JSON.stringify(newJournal))
  
  fs.writeFileSync(filename, JSON.stringify(newJournal))  

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({"response": 'success'})
}

export default AddJournal
