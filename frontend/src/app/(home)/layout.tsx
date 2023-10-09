import "../globals.css";
import 'radar-sdk-js/dist/radar.css';

import { Metadata } from "next";
import Providers from "@/contexts/providers";
import React from 'react';

export const metadata: Metadata = {
  title: "Multifamily Valuation - Taylor Avakain",
  // openGraph: {
  //   title: "Liftoff - AI-Powered Mock Interviews",
  //   description:
  //     "Liftoff is an AI-powered mock interview platform that helps you practice for your next job interview.",
  //   images: [
  //     {
  //       url: "https://demo.useliftoff.com/opengraph-image",
  //     },
  //   ],
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Liftoff - AI-Powered Mock Interviews",
  //   description:
  //     "Liftoff is an AI-powered mock interview platform that helps you practice for your next job interview.",
  //   images: ["https://demo.useliftoff.com/opengraph-image"],
  //   creator: "@tmeyer_me",
  // },
  // metadataBase: new URL("https://demo.useliftoff.com"),
  themeColor: "#FFF",
};

const NEXT_PUBLIC_GA_ID: string = process.env["NEXT_PUBLIC_GA_ID"]!;

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${NEXT_PUBLIC_GA_ID}`}/>
        <script
          dangerouslySetInnerHTML={{
            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag() {dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('config', '${NEXT_PUBLIC_GA_ID}', {
                  page_path: window.location.pathname
                });

                window.gtag = gtag;
              `}}
        />
      </head>
      <body className="scroll-smooth antialiased [font-feature-settings:'ss01']">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
