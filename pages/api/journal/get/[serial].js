import {useRouter} from 'next/router'
import fs from 'fs'

const getJournal = async (req, res) => {
  const {
    query: { serial },
  } = req;

  const filename = `./journals/${serial}.json`
  const journal = fs.existsSync(filename) ? JSON.parse(fs.readFileSync(filename)) : []

  res.setHeader('Content-Type', 'application/json');
  res.json(journal)
}

export default getJournal
