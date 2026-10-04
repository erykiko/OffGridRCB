import { ScrollView, StyleSheet, Text, View } from 'react-native';
import type { ListenerState } from '../../ble';
import { useAlerts } from '../../alerts/AlertsContext';
import { AlertCard, Button, Card, SectionTitle } from '../../ui/components';
import { formatNodeId } from '../../ui/format';
import { type Palette, font, usePalette } from '../../ui/theme';

const STATUS_LABEL: Record<ListenerState, string> = {
  idle: 'Nasłuch wyłączony',
  permissions_missing: 'Brak uprawnień Bluetooth',
  bluetooth_off: 'Bluetooth jest wyłączony',
  bluetooth_unauthorized: 'Brak zgody na Bluetooth',
  unsupported: 'Ten telefon nie obsługuje Bluetooth LE',
  scanning: 'Szukam węzła…',
  connecting: 'Łączę z węzłem…',
  connected: 'Połączono z węzłem',
  reconnecting: 'Ponowne łączenie…',
  error: 'Problem z połączeniem',
};

function statusColor(state: ListenerState, p: Palette): string {
  switch (state) {
    case 'connected':
      return p.ok;
    case 'scanning':
    case 'connecting':
    case 'reconnecting':
      return p.warn;
    case 'idle':
      return p.muted;
    default:
      return p.bad;
  }
}

const ACTIVE: ListenerState[] = ['scanning', 'connecting', 'connected', 'reconnecting'];

export default function NodeScreen() {
  const p = usePalette();
  const a = useAlerts();
  const { status } = a;
  const last = a.latestNotified?.alert;
  const silenced = a.records.length > 0 && a.records[0] !== a.latestNotified;

  return (
    <ScrollView style={{ backgroundColor: p.bg }} contentContainerStyle={styles.content}>
      <Card>
        <View style={styles.row}>
          <View style={[styles.dot, { backgroundColor: statusColor(status.state, p), borderColor: p.border }]} />
          <Text style={[font.heading, styles.status, { color: p.text }]}>{STATUS_LABEL[status.state]}</Text>
        </View>
        {status.state === 'connected' && (
          <Text style={[font.body, { color: p.muted }]}>Węzeł {formatNodeId(status.nodeId)}</Text>
        )}
        {status.state === 'reconnecting' && status.retryInMs !== undefined && (
          <Text style={[font.body, { color: p.muted }]}>Kolejna próba za {Math.ceil(status.retryInMs / 1000)} s</Text>
        )}
        {status.missingPermissions.length > 0 && (
          <Text style={[font.body, { color: p.muted }]}>Brakuje: {status.missingPermissions.join(', ')}</Text>
        )}
        {status.lastError && <Text style={[font.small, { color: p.muted }]}>{status.lastError}</Text>}

        <View style={styles.actions}>
          {status.state === 'bluetooth_off' && (
            <Button title="Ustawienia Bluetooth" onPress={a.openBluetoothSettings} />
          )}
          {(status.state === 'permissions_missing' || status.state === 'bluetooth_unauthorized') && (
            <>
              <Button title="Nadaj uprawnienia" onPress={a.restart} />
              <Button title="Ustawienia aplikacji" variant="secondary" onPress={a.openAppSettings} />
            </>
          )}
          {(status.state === 'idle' || status.state === 'error' || status.state === 'bluetooth_off') && (
            <Button
              title="Szukaj węzła"
              variant={status.state === 'bluetooth_off' ? 'secondary' : 'primary'}
              onPress={a.restart}
            />
          )}
          {ACTIVE.includes(status.state) && (
            <>
              <Button title="Szukaj ponownie" variant="secondary" onPress={a.restart} />
              <Button title="Zatrzymaj" variant="secondary" onPress={a.stop} />
            </>
          )}
        </View>
      </Card>

      {(!status.notificationsAllowed || status.canRequestFullScreenIntent) && (
        <Card>
          <Text style={[font.body, { color: p.text }]}>
            {status.notificationsAllowed
              ? 'Alerty nie otworzą się na pełnym ekranie. Zezwól na to w ustawieniach.'
              : 'Powiadomienia są wyłączone. Alerty będą widoczne tylko w aplikacji.'}
          </Text>
          <Button
            title="Otwórz ustawienia"
            variant="secondary"
            onPress={status.notificationsAllowed ? a.openFullScreenSettings : a.openAppSettings}
          />
        </Card>
      )}

      <SectionTitle>Ostatni alert</SectionTitle>
      {last ? (
        <AlertCard alert={last} />
      ) : (
        <Card>
          <Text style={[font.body, { color: p.muted }]}>Brak alertów. Pojawią się tutaj, gdy węzeł je przekaże.</Text>
        </Card>
      )}
      {silenced && (
        <Text style={[font.small, { color: p.muted }]}>Nowsze alerty od wyciszonych wydawców są w historii.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  dot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2 },
  status: { flexShrink: 1 },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
});
