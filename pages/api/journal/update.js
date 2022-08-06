import fs from 'fs'

const updateJournal = async (req, res) => {
  let id 
  let entry
  let index
  if (req.body.hasOwnProperty('id')) {
     id = req.body.id
     entry = req.body.entry
     index = req.body.index
  } else {
     const b = JSON.parse(req.body)
     id = b.id
     entry = b.entry
     index = b.index
  }

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
  res.json({"response": "success"})
}

export default updateJournal