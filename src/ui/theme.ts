import type { Severity } from '../ble';
import { palette, type Palette } from './palette';

export { SEVERITY_COLOR, type Palette } from './palette';

/** The app is light-only (app.json userInterfaceStyle). Kept as a hook so screens don't care. */
export function usePalette(): Palette {
  return palette;
}

export const SEVERITY_LABEL: Record<Severity, string> = {
  test: 'Test',
  info: 'Informacja',
  warning: 'Ostrzeżenie',
  severe: 'Poważne zagrożenie',
  extreme: 'Skrajne zagrożenie',
};

/** Type scale (sp). Android system font; size and weight carry the hierarchy. */
export const font = {
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800' as const },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' as const },
  section: { fontSize: 17, lineHeight: 22, fontWeight: '700' as const },
  body: { fontSize: 16, lineHeight: 23 },
  small: { fontSize: 14, lineHeight: 20 },
};
