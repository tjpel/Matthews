import * as React from 'react';
import { Metadata } from 'next';

import { Analytics } from '@/components/analytics';

import './global.css';
import styles from './layout.module.css';

export const metadata: Metadata = {
  title: 'Multifamily Valuation - Taylor Avakain'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang='en'>
  <head>
    <Analytics/>
  </head>
  <body>
    <div className={styles.app}>
      {children}
    </div>
  </body>
  </html>;
}
