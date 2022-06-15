// pages/_app.js
import '../styles/globals.css'
import Head from 'next/head'

const MyApp = ({ Component, pageProps }) =>{
  return (
    <>
      <Head>
        <meta name="viewport" content="width=1024, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
