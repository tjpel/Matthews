import { Arrow } from '@/svg/arrow';
import { GradientCanvas } from './gradient';

import styles from './page.module.css';
import { NoiseBackground } from '@/components/noise-background';
import * as React from 'react';

export default function Page() {
  return <>
    <NoiseBackground opacity={0.35} />
    <div className={styles.front}>
      <div className={styles.title}>
        <h2 className={styles.taylor}>Taylor Avakian</h2>

        <h1>
          Find Your <br />
          Multifamily <span className={styles.primary}>Valuation.</span>
        </h1>

        <div className={styles.recs}>
          <div>
            <h3>Valuator</h3>

            Use our AI for for free to get an estimate on your multifamily property's value.
          </div>
          <div>
            <h3>Connect</h3>

            Connect with us to gain invaluable insights from industry leaders and experts.
          </div>
        </div>

        <div className={styles.actions}>
          <a className='button'>All About Us</a>

          <a className='button'>Contact Us</a>

          <a className='button primary' href='./estimator'>Try it out <Arrow /></a>
        </div>
      </div>

      <GradientCanvas />
    </div>

    <div className={styles.bar} />
  </>;
}
