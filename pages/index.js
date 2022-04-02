import Slideshow from '../components/Slideshow'

function Index() {
  const serial = '816a263e7954a5ceb4cc608f61a89640'
  const method = 'http'

  return ( 
    <Slideshow serial={serial} camera={1} method={method}/> 
  )
}

export default Index;