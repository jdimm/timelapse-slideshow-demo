// pages/_app.js
import '../styles/globals.css'
import Head from 'next/head'

const MyApp = ({ Component, pageProps }) =>{
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=0.86, maximum-scale=10.0, minimum-scale=0.2" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
