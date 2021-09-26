import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Template from '../components/template'

function MyApp({ Component, pageProps, router }: AppProps) {
  const fullWindow = ['/signup', '/login', '/password'].includes(router.pathname);

  return <Template fullWindow={fullWindow}><Component {...pageProps} /></Template>
}
export default MyApp
