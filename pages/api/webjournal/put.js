import fs from 'fs'

const putJournal = async (req, res) => {
  const {id, journal} = req.body
  const filename = `./webjournals/${id}.json`
  fs.writeFileSync(filename, JSON.stringify(journal))
  
  res.setHeader('Content-Type', 'application/json');
  res.json({"response": "success"})
}

export default putJournal