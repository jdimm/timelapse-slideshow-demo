// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  console.log('trying to keep going after return..')
  setTimeout(() => {
    console.log('timeout happened, seems to work')
  }, 5000)
  res.status(200).json({ name: 'John Doe' })
}
