import { CATEGORY_LABEL, type Category } from '../ble';

// UI metadata per category (PROTOCOL.md 4.1). Severity comes from the signed alert, not from here.

export interface CategoryInfo {
  label: string;
  /** Service the category is modelled on. */
  source: 'RCB' | 'GOPR' | 'WOPR' | 'PSP' | 'PRM';
}

const META: Record<Category, Omit<CategoryInfo, 'label'>> = {
  other: { source: 'RCB' },
  fire: { source: 'PSP' },
  flood: { source: 'RCB' },
  accident: { source: 'RCB' },
  medical: { source: 'PRM' },
  storm: { source: 'RCB' },
  strong_wind: { source: 'RCB' },
  heat: { source: 'RCB' },
  frost: { source: 'RCB' },
  heavy_snow: { source: 'RCB' },
  chemical_hazard: { source: 'RCB' },
  air_threat: { source: 'RCB' },
  power_outage: { source: 'RCB' },
  water_contamination: { source: 'RCB' },
  missing_person: { source: 'RCB' },
  avalanche: { source: 'GOPR' },
  mountain_danger: { source: 'GOPR' },
  water_rescue: { source: 'WOPR' },
};

export function categoryInfo(c: Category): CategoryInfo {
  return { label: CATEGORY_LABEL[c], ...(META[c] ?? META.other) };
}
