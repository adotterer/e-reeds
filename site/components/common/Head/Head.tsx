import type { VFC } from 'react'
import { useEffect } from 'react'
import { SEO } from '@components/common'
import Script from 'next/script'

const gacode = process.env.NEXTJS_G as String

const Head: VFC = () => {
  return (
    <>
      <SEO>
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
      </SEO>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=UA-154751259-2`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         gtag('js', new Date());
       
         gtag('config', 'UA-154751259-2');
        `}
      </Script>
    </>
  )
}

export default Head
