import fs from 'fs'

const getJournal = async (req, res) => {
  const {
    query: { id, start, end },
  } = req;

  let journal = []
  const filename = `./journals/${id}.json`
  if (fs.existsSync(filename)) {
    const contents = fs.readFileSync(filename)
    if (contents && contents.length > 0) {  
      journal = JSON.parse(contents)
      let index = 0
      journal = journal.map(entry => {
        if (typeof entry === "object") {
          entry['index'] = index++
          return entry
        } else {
          const j = JSON.parse(entry)
          console.log("j", j)
          j['index'] = index++
          return j
        }
      })
    } 
  }

  if (start && end) {
    journal = journal.slice(start, end)
  }

  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.json(journal)
}

export default getJournal
