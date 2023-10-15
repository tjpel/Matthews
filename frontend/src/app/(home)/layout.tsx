import "../globals.css";
import 'radar-sdk-js/dist/radar.css';

import { Metadata } from "next";
import Providers from "@/contexts/providers";
import GoogleAnalytics from '@/components/google-analytics';

const GA_ID = process.env["NEXT_PUBLIC_GA_ID"]!;

export const metadata: Metadata = {
  title: "Multifamily Valuation - Taylor Avakain",
  themeColor: "#FFF",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className="scroll-smooth antialiased [font-feature-settings:'ss01']">
        <Providers>
          {children}
        </Providers>

        <GoogleAnalytics ga_id={GA_ID} />
      </body>
    </html>
  );
}
