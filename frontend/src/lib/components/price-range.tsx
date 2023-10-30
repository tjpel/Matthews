import { classes } from '@/util';

import styles from './price-range.module.css';

const percent = (n: number) => (n * 100) + '%';
const money = (n: number) => '$' + Math.ceil(n).toLocaleString('en-US');

export function PriceRange(props: {
  price: number
}) {
  const low = props.price * 0.9;
  const high = props.price * 1.1;

  const max = (Math.floor((high - 1000) * 1.3 / 1000)) * 1000;

  const lowOffset = low / max;
  const midOffset = props.price / max;
  const highOffset = high / max;

  return <div className={styles.wrapper}>
    <div className={styles.line}>
      <div
        className={styles.range}
        style={{
          '--pos': percent(lowOffset),
          width: percent(highOffset - lowOffset)
        }}
      />

      {/* mobile element */}
      <div
        className={styles.label}
      >
        Mean: <strong>{money(props.price)}</strong>
        <br/>
        Range: <strong>{money(low)}–{money(high)}</strong>
      </div>

      {/* desktop elements */}
      <div
        className={classes([styles.popup, styles.low])}
        style={{
          '--pos': percent(lowOffset)
        }}>
        Low: <strong>{money(low)}</strong>
      </div>
      <div
        className={classes([styles.popup, styles.mid])}
        style={{
          '--pos': percent(midOffset)
        }}>
        Mean: <strong>{money(props.price)}</strong>
      </div>
      <div
        className={classes([styles.popup, styles.high])}
        style={{
          '--pos': percent(highOffset)
        }}>
        High: <strong>{money(high)}</strong>
      </div>
    </div>
  </div>;
}
