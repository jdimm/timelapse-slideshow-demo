import fs from 'fs'

const updateJournal = async (req, res) => {
  const {id, entry, index} = JSON.parse(req.body)

  console.log("id: ", id, "entry: ", entry, "index: ", index)

  const filename = `./journals/${id}.json`
  const journal = fs.existsSync(filename) 
    ? JSON.parse(fs.readFileSync(filename)) 
    : []

  if (index >= 0 && index < journal.length && entry != {}) {
    journal[index] = entry
    console.log("index: ", index, "entry: ", entry)

    fs.writeFileSync(filename, JSON.stringify(journal))
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(journal)
}

export default updateJournal