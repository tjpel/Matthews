import * as React from 'react';
import { Metadata } from 'next';

import "./global.css";
import styles from "./layout.module.css"

export const metadata: Metadata = {
  title: "Multifamily Valuation - Taylor Avakain"
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return <html lang="en">
    <body>
      <div className={styles.app}>
        {children}
      </div>
    </body>
  </html>
}
