import Script from 'next/script';

const NEXT_PUBLIC_GA_ID: string = process.env["NEXT_PUBLIC_GA_ID"]!;

declare global {
  interface Window {
    gtag(command: string, ...params: any): void;
  }
}

export const Analytics = () => (
  <>
    <Script async src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GA_ID}`}></Script>
    <Script id="ga-analytics" strategy="afterInteractive">{`
      window.dataLayer = window.dataLayer || [];
      function gtag() {dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', '${NEXT_PUBLIC_GA_ID}');

      window.gtag = gtag;
     `}</Script>
  </>
);

export default Analytics;

