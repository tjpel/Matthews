'use client';

import { useEffect, useState } from 'react';

import { classes } from '@/util';
import { gradient } from '@/components/gradient';

import styles from './page.module.css';

export function GradientCanvas() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    gradient.initGradient('#gradient-canvas');
    setReady(true);
  }, []);

  return <>
    <canvas
      id='gradient-canvas'
      className={classes({
        [styles.gradientCanvas]: true,
        [styles.hidden]: !ready
      })}
    />
    <div className={styles.gradientCover}/>
  </>;
}
