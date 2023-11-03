import styles from './noise-background.module.css';

export function NoiseBackground(props: {
  opacity: number
}) {
  return <svg className={styles.background} style={{opacity: props.opacity}}>
    <filter id='noise'>
      <feTurbulence type='fractalNoise' baseFrequency='.7' numOctaves='3' stitchTiles='stitch' />
      <feColorMatrix type='saturate' values='0' />
    </filter>
    <rect width='100%' height='100%' filter='url(#noise)' />
  </svg>;
}
