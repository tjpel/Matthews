'use client'

import { useEffect } from 'react';

import {gradient} from '@/components/gradient';

import styles from './page.module.css';

export function GradientCanvas() {
  useEffect(() => {
    gradient.initGradient('gradient-canvas');
  }, []);

  return <canvas
    id='gradient-canvas'
    className={styles.gradientCanvas}
  />
}
