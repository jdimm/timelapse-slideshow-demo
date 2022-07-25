import {useRuter} from 'next/router'
import fs from 'fs'

const deleteJournalEntry = async (req, res) => {
  const {index, serial} = req.query

  console.log(`serial: ${serial}, index: ${index}`)

  const filename = `./journals/${serial}.json`
  const journal = fs.existsSync(filename) 
    ? JSON.parse(fs.readFileSync(filename)) 
    : []
  
  console.log("journal: ", journal)
  if (index < journal.length) {
    journal.splice(index, 1)
    console.log("spliced", journal)
  }


  console.log("newJournal: ", journal)
  fs.writeFileSync(filename, JSON.stringify(journal))

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json({"results":"ok"})
}

export default deleteJournalEntry
