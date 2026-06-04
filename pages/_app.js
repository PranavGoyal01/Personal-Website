import '../styles/globals.css'
import { useEffect } from 'react'

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // placeholder for GA init when ID is available
  }, [])
  return <Component {...pageProps} />
}
