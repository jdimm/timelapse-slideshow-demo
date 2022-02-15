import Slideshow from '../components/Slideshow'

function Index() {
  const serial = 'ff2bb085f94680c754072062a61dd5b1'

  return ( 
    <Slideshow serial={serial} camera={1} /> 
  )
}

export default Index;