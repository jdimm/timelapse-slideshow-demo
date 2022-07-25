import fs from 'fs'

const putJournal = async (req, res) => {
  const {serial, journal} = req.body
  const filename = `./journals/${serial}.json`
  fs.writeFileSync(filename, JSON.stringify(journal))
  
  res.setHeader('Content-Type', 'application/json');
  res.json(journal)
}

export default putJournal