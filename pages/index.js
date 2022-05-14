import Slideshow from '../components/Slideshow'
import nice from '../data/nice'

function Index() {
 // const serial = '816a263e7954a5ceb4cc608f61a89640'
  //const method = 'http'
  const method = 'azure-small'

  const html = nice.map( (serial, idx) => {
    return (
      <div key={idx}>
        <Slideshow serial={serial} camera={1} method={method}/> 
        <Slideshow serial={serial} camera={2} method={method}/>
      </div>
    )
  })
  
  return html

}

export default Index;