import Head from 'next/head'
import Script from 'next/script'
import 'tailwindcss/tailwind.css'
import '../styles/globals.css'
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        strategy='lazyOnload'
        src={`https://www.googletagmanager.com/gtag/js?id=G-5YEYZQRFZY`}
      />
      <Script strategy='lazyOnload'>
        {`window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-5YEYZQRFZY');`}
      </Script>
      <Head>
        <meta charSet='utf-8' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta
          name='viewport'
          content='width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=5'
        />
        <meta name='author' content='Rois Faozi' />
        <meta
          name='description'
          content='Rois Faozi is a Front End Developer and UI/UX Designer based in the Indonesia.'
        />
        <meta
          name='keywords'
          content='hire front end developer, Front end Developer, rois faozi, react developer, javascript developer, Front end Developer skills, junior front end developer, front end developer resume, build website from scratch, '
        />
        <title>Rois Faozi | Front end Developer</title>
        <meta
          name='google-site-verification'
          content='ddhhfnmyDg0wvJYkBFXYDLkdfYpsU195tvAYxH0kB1I'
        />
        <meta property='og:locale' content='id_id' />
        <meta property='og:site_name' content="Rois Faozi's Portfolio"></meta>
        <meta property='og:type' content='website' />
        <meta property='og:title' content='Rois Faozi – Front end Developer' />
        <meta
          name='og:description'
          content='Rois Faozi is a Front End Developer and UI/UX Designer based in the Indonesia.'
        />
        <meta
          name='og:keywords'
          content='hire front end developer, Front end Developer, rois faozi, react developer, javascript developer, Front end Developer skills, junior front end developer, front end developer resume, build website from scratch, '
        />
        <meta property='twitter:card' content='summary_large_image' />
        <meta
          property='twitter:title'
          content='Rois Faozi – Front end Developer'
        />
        <meta
          name='twitter:description'
          content='Rois Faozi is a Front End Developer and UI/UX Designer based in the Indonesia.'
        />
        <meta
          name='twitter:keywords'
          content='hire front end developer, Front end Developer, rois faozi, react developer, javascript developer, Front end Developer skills, junior front end developer, front end developer resume, build website from scratch, '
        />
        <link rel='manifest' href='/manifest.json' />
        <link
          rel='apple-touch-icon'
          sizes='57x57'
          href='/apple-icon-57x57.png'
        />
        <link
          href='/favicon.ico'
          rel='shortcut icon'
          type='image/x-icon'></link>
        <link
          rel='apple-touch-icon'
          sizes='60x60'
          href='icons/apple-icon-60x60.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='72x72'
          href='icons/apple-icon-72x72.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='76x76'
          href='icons/apple-icon-76x76.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='114x114'
          href='icons/apple-icon-114x114.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='120x120'
          href='icons/apple-icon-120x120.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='144x144'
          href='icons/apple-icon-144x144.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='152x152'
          href='icons/apple-icon-152x152.png'
        />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='icons/apple-icon-180x180.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='192x192'
          href='icons/android-icon-192x192.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='icons/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='96x96'
          href='icons/favicon-96x96.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='icons/favicon-16x16.png'
        />
        <link rel='manifest' href='/manifest.json' />
        <meta name='msapplication-TileColor' content='#ffffff' />
        <meta name='msapplication-TileImage' content='/ms-icon-144x144.png' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
