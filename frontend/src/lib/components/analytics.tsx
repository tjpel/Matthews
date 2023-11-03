import Script from 'next/script';

import * as env from '@/env';

export function Analytics() {
  return <>
    <Script async src={`https://www.googletagmanager.com/gtag/js?id=${env.GA_KEY}`}/>
    <Script dangerouslySetInnerHTML={{__html: `
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());

      gtag('config', '${env.GA_KEY}');

      window.gtag = gtag;
    `}} />
  </>
}
