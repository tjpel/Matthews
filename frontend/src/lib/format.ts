import { Formatter } from '@/components/input';

export const number = (): Formatter => (source, pos) => {
  const cleaned = source.replace(/\D/g, '');
  const n = BigInt(cleaned);

  if (cleaned.length > 0) {
    const out = n.toLocaleString('en-US');

    const oldCommas = Math.ceil(pos / 4) - 1;
    const cleanedPos = pos - oldCommas;
    const newCommas = Math.ceil(out.length / 4) - 1;
    const leftCommas = Math.floor((cleaned.length - cleanedPos) / 3);
    const rightCommas = newCommas - leftCommas;

    return [out, cleanedPos + rightCommas];
  } else {
    return ['', 0];
  }
};

export const phone = (): Formatter => (source) => {
  const cleaned = source.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1,3})(\d{1,3})?(\d{1,4})?\d*$/) || [];

  const offset = (i: number): number =>
    i <= 3 ? 1 : i <= 6 ? 3 : 4;

  return [`(${match[1]?.padEnd(3) || '   '}) ${match[2]?.padEnd(3) || '   '}-${match[3]?.padEnd(4) || '    '}`, cleaned.length + offset(cleaned.length)];
};
