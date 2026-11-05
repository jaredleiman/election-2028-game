import type { Poll } from '@/types';

const NEUTRAL = [84, 98, 122];
const DEM = [37, 99, 235];
const REP = [220, 38, 38];

export function leanColor(margin: number): string {
  const strength = Math.min(1, Math.abs(margin) / 12);
  const target = margin >= 0 ? DEM : REP;
  const mix = 0.2 + 0.8 * strength;
  const [r, g, b] = NEUTRAL.map((n, i) => Math.round(n + (target[i] - n) * mix));
  return `rgb(${r}, ${g}, ${b})`;
}

export function isSwing(poll: Poll): boolean {
  return Math.abs(poll.dem - poll.rep) < 2.5;
}
