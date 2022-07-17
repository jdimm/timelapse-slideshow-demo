import fs from 'fs'

const putJournal = async (req, res) => {
  const serial = req.body.serial ? req.body.serial : 'fakeserial'
  const newJournal = req.body.journal ? req.body.journal : []

  const filename = `./journals/${serial}.json`
  console.log("PutJournal", filename)
  fs.writeFileSync(filename, JSON.stringify(newJournal))

  res.setHeader('Content-Type', 'application/json');
  res.json(newJournal)
}

export default putJournal