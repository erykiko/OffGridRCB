import { describe, expect, it } from 'vitest';
import { contrastRatio, palette, SEVERITY_COLOR } from '../palette';

// WCAG AAA for normal text: 7:1.
const AAA = 7;

describe('palette contrast', () => {
  it('computes WCAG contrast ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
  });

  it.each(['text', 'muted', 'primary', 'ok', 'warn', 'bad'] as const)('%s text on the background is AAA', (k) => {
    expect(contrastRatio(palette[k], palette.bg)).toBeGreaterThanOrEqual(AAA);
    expect(contrastRatio(palette[k], palette.card)).toBeGreaterThanOrEqual(AAA);
  });

  it.each(['primary', 'bad', 'text'] as const)('white text on %s fills is AAA', (k) => {
    expect(contrastRatio(palette.onFill, palette[k])).toBeGreaterThanOrEqual(AAA);
  });

  it.each(Object.entries(SEVERITY_COLOR))('white text on the %s severity band is AAA', (_, color) => {
    expect(contrastRatio(palette.onFill, color)).toBeGreaterThanOrEqual(AAA);
  });

  it('borders stand out from the background (non-text contrast >= 3:1, here far more)', () => {
    expect(contrastRatio(palette.border, palette.bg)).toBeGreaterThanOrEqual(AAA);
  });
});
