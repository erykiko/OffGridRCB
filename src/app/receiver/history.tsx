import { useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { areaLabel, providerForKey } from '../../ble';
import { useAlerts } from '../../alerts/AlertsContext';
import { categoryInfo } from '../../alerts/categoryInfo';
import type { HistoryRecord } from '../../history';
import { AlertCard, Button, Card, SeverityBand } from '../../ui/components';
import { confirmDestructive } from '../../ui/confirm';
import { formatDateTime, formatNodeId } from '../../ui/format';
import { SEVERITY_LABEL, font, usePalette } from '../../ui/theme';

function DetailRow({ label, value }: { label: string; value: string }) {
  const p = usePalette();
  return (
    <View style={styles.detailRow}>
      <Text style={[font.small, styles.detailLabel, { color: p.muted }]}>{label}</Text>
      <Text style={[font.small, styles.detailValue, { color: p.text }]} selectable>
        {value}
      </Text>
    </View>
  );
}

function AlertDetails({ record, onClose }: { record: HistoryRecord; onClose: () => void }) {
  const p = usePalette();
  const { alert } = record;
  const info = categoryInfo(alert.category);
  const { mutedProviders } = useAlerts();
  const provider = providerForKey(alert.keyId);
  const issuer = provider
    ? `${provider.name}${mutedProviders.has(provider.id) ? ' (wyciszony)' : ''}`
    : `klucz ${alert.keyId}`;
  return (
    <Modal transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable onPress={() => undefined}>
          <Card style={styles.modalCard}>
            <SeverityBand severity={alert.severity} />
            <View style={styles.modalBody}>
              <Text style={[font.heading, { color: p.text }]}>{info.label}</Text>
              <Text style={[font.body, { color: p.text }]} selectable>
                {alert.text}
              </Text>
              <DetailRow label="Poziom" value={SEVERITY_LABEL[alert.severity]} />
              <DetailRow label="Obszar" value={areaLabel(alert.areaCode)} />
              <DetailRow label="Wydawca" value={issuer} />
              <DetailRow label="Źródło" value={info.source} />
              <DetailRow label="Wydano" value={formatDateTime(alert.issuedAt)} />
              <DetailRow label="Wygasa" value={formatDateTime(alert.expiresAt)} />
              <DetailRow label="Odebrano" value={formatDateTime(alert.receivedAt)} />
              <DetailRow label="Węzeł" value={formatNodeId(alert.nodeId)} />
              <DetailRow label="ID alertu" value={String(alert.id)} />
              <DetailRow label="Hash" value={record.hash.slice(0, 16) + '…'} />
              <Button title="Zamknij" onPress={onClose} />
            </View>
          </Card>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export default function HistoryScreen() {
  const p = usePalette();
  const { records, chain, clearHistory } = useAlerts();
  const [selected, setSelected] = useState<HistoryRecord | null>(null);

  const confirmClear = () =>
    confirmDestructive(
      'Wyczyścić historię?',
      'Wszystkie zapisane alerty zostaną usunięte z telefonu.',
      'Wyczyść',
      clearHistory,
    );

  return (
    <View style={[styles.flex, { backgroundColor: p.bg }]}>
      <FlatList
        data={records}
        keyExtractor={(r) => r.hash}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          records.length > 0 ? (
            <Text style={[font.body, styles.chain, { color: chain.ok ? p.ok : p.bad }]}>
              {chain.ok ? 'Historia spójna' : `Historia naruszona (rekord #${chain.brokenAt})`}
            </Text>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityHint="Pokaż szczegóły alertu"
            onPress={() => setSelected(item)}
            style={({ pressed }) => pressed && { opacity: 0.75 }}
          >
            <AlertCard alert={item.alert} compact />
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={[font.body, styles.empty, { color: p.muted }]}>
            Brak alertów. Każdy sprawdzony alert zostanie tu zapisany.
          </Text>
        }
        ListFooterComponent={
          records.length > 0 ? (
            <View style={styles.footer}>
              <Text style={[font.small, { color: p.muted }]}>Zapisano: {records.length}</Text>
              <Button title="Wyczyść historię" variant="danger" onPress={confirmClear} />
            </View>
          ) : null
        }
      />
      {selected && <AlertDetails record={selected} onClose={() => setSelected(null)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  list: { padding: 16, gap: 12 },
  chain: { fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 48 },
  footer: { alignItems: 'center', gap: 8, marginTop: 12 },
  backdrop: { flex: 1, backgroundColor: '#000000b3', justifyContent: 'center', padding: 16 },
  modalCard: { padding: 0, gap: 0, overflow: 'hidden' },
  modalBody: { padding: 16, gap: 6 },
  detailRow: { flexDirection: 'row', gap: 12 },
  detailLabel: { width: 84 },
  detailValue: { flex: 1 },
});
