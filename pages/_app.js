import { useEffect } from 'react'
import '../styles/globals.css'

export default function App({ Component, pageProps }) {
	useEffect(() => {
		// placeholder for GA init when ID is available
	}, [])

	return <Component {...pageProps} />
}
