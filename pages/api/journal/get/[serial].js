import fs from 'fs'

const getJournal = async (req, res) => {
  const {
    query: { serial, start, end },
  } = req;

  let journal = []
  const filename = `./journals/${serial}.json`
  if (fs.existsSync(filename)) {
    const contents = fs.readFileSync(filename)
    if (contents && contents.length > 0) {  
      journal = JSON.parse(contents)
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
