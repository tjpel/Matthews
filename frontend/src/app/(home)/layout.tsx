import "../globals.css";
import 'radar-sdk-js/dist/radar.css';

import { Metadata } from "next";
import Providers from "@/contexts/providers";
import Analytics from '@/components/analytics';

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <head>
        <Analytics/>
      </head>
      <body className="scroll-smooth antialiased [font-feature-settings:'ss01']">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
