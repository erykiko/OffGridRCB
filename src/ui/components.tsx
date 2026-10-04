import React from 'react';
import { Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { areaLabel } from '../ble';
import { categoryInfo } from '../alerts/categoryInfo';
import type { StoredAlert } from '../history';
import { formatDateTime, formatRelative } from './format';
import { SEVERITY_COLOR, SEVERITY_LABEL, font, usePalette } from './theme';
import type { Severity } from '../ble';

const BORDER = 2;

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  const p = usePalette();
  return <View style={[styles.card, { backgroundColor: p.card, borderColor: p.border }, style]}>{children}</View>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}) {
  const p = usePalette();
  const bg = variant === 'primary' ? p.primary : variant === 'danger' ? p.bad : p.card;
  const fg = variant === 'secondary' ? p.text : p.onFill;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, borderColor: variant === 'secondary' ? p.border : bg },
        pressed && (variant === 'secondary' ? { backgroundColor: p.tint } : { opacity: 0.8 }),
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

/** Selectable option in a row of choices. Selected = solid black, so it never relies on hue alone. */
export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const p = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        { borderColor: p.border, backgroundColor: selected ? p.text : pressed ? p.tint : p.card },
      ]}
    >
      <Text style={[styles.chipText, { color: selected ? p.onFill : p.text }]}>{label}</Text>
    </Pressable>
  );
}

export function SectionTitle({ children }: { children: string }) {
  const p = usePalette();
  return (
    <Text accessibilityRole="header" style={[font.section, styles.section, { color: p.text }]}>
      {children}
    </Text>
  );
}

/** Solid band in the severity color with the level in capitals, like public warning signage. */
export function SeverityBand({ severity }: { severity: Severity }) {
  const p = usePalette();
  return (
    <View style={[styles.band, { backgroundColor: SEVERITY_COLOR[severity] }]}>
      <Text style={[styles.bandText, { color: p.onFill }]}>{SEVERITY_LABEL[severity].toLocaleUpperCase('pl')}</Text>
    </View>
  );
}

/** An alert as a card: severity band on top, then category, area, text and time. */
export function AlertCard({ alert, compact }: { alert: StoredAlert; compact?: boolean }) {
  const p = usePalette();
  const info = categoryInfo(alert.category);
  return (
    <View style={[styles.alertCard, { borderColor: p.border, backgroundColor: p.card }]}>
      <SeverityBand severity={alert.severity} />
      <View style={styles.alertBody}>
        <View style={styles.alertHead}>
          <Text style={[font.heading, styles.flex, { color: p.text }]}>{info.label}</Text>
          <Text style={[font.small, { color: p.muted }]}>{formatRelative(alert.receivedAt)}</Text>
        </View>
        <Text style={[font.small, { color: p.muted }]}>{areaLabel(alert.areaCode)}</Text>
        <Text style={[font.body, { color: p.text }]} numberOfLines={compact ? 3 : undefined}>
          {alert.text}
        </Text>
        {!compact && <Text style={[font.small, { color: p.muted }]}>Wydano {formatDateTime(alert.issuedAt)}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 4, borderWidth: BORDER, padding: 16, gap: 10 },
  button: {
    minHeight: 48,
    borderRadius: 4,
    borderWidth: BORDER,
    paddingVertical: 10,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { fontWeight: '700', fontSize: 16 },
  disabled: { opacity: 0.35 },
  chip: { minHeight: 40, borderRadius: 4, borderWidth: BORDER, paddingHorizontal: 12, justifyContent: 'center' },
  chipText: { fontSize: 15, fontWeight: '600' },
  section: { marginTop: 12 },
  band: { paddingVertical: 8, paddingHorizontal: 14 },
  bandText: { fontSize: 15, fontWeight: '800', letterSpacing: 0.8 },
  alertCard: { borderRadius: 4, borderWidth: BORDER, overflow: 'hidden' },
  alertBody: { padding: 14, gap: 4 },
  alertHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8 },
  flex: { flex: 1 },
});
