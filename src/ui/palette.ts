import type { Severity } from '../ble/types';

// Light, high-contrast palette. Every text color reaches WCAG AAA (7:1) on the background, and white text
// reaches AAA on every filled color (enforced by src/ui/__tests__/palette.test.ts). Pure TS: no React Native.

export const palette = {
  bg: '#ffffff',
  card: '#ffffff',
  /** Pressed / selected surfaces that stay light. */
  tint: '#e8ecf5',
  text: '#000000',
  muted: '#383838',
  border: '#000000',
  /** Text and icons on filled colors (primary, bad, severity bands). */
  onFill: '#ffffff',
  primary: '#0038a8',
  ok: '#0a6630',
  warn: '#874200',
  bad: '#a8001c',
};

export type Palette = typeof palette;

/** Severity bands, modelled on warning signage: darker and hotter with severity, white text on top. */
export const SEVERITY_COLOR: Record<Severity, string> = {
  test: '#4a4a4a',
  info: '#0038a8',
  warning: '#874200',
  severe: '#9e2a00',
  extreme: '#a8001c',
};

function channel(hex: string, i: number): number {
  const c = parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  return 0.2126 * channel(hex, 0) + 0.7152 * channel(hex, 1) + 0.0722 * channel(hex, 2);
}

/** WCAG 2.x contrast ratio between two #rrggbb colors. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}
