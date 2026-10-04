import { router } from 'expo-router';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { PROVIDERS } from '../../ble';
import { useAlerts } from '../../alerts/AlertsContext';
import { Button, Card, SectionTitle } from '../../ui/components';
import { font, usePalette } from '../../ui/theme';

export default function SettingsScreen() {
  const p = usePalette();
  const { mutedProviders, setProviderMuted } = useAlerts();

  return (
    <ScrollView style={{ backgroundColor: p.bg }} contentContainerStyle={styles.content}>
      <SectionTitle>Wydawcy alertów</SectionTitle>
      <Card>
        {PROVIDERS.map((provider) => {
          const enabled = !mutedProviders.has(provider.id);
          return (
            <View key={provider.id} style={styles.row}>
              <View style={styles.flex}>
                <Text style={[font.section, { color: p.text }]}>{provider.name}</Text>
                <Text style={[font.small, { color: enabled ? p.ok : p.bad }]}>
                  {enabled ? 'Powiadomienia włączone' : 'Wyciszony'}
                </Text>
              </View>
              <Switch
                accessibilityLabel={`Powiadomienia: ${provider.name}`}
                value={enabled}
                onValueChange={(on) => setProviderMuted(provider.id, !on)}
                trackColor={{ true: p.primary, false: p.muted }}
                thumbColor={p.onFill}
              />
            </View>
          );
        })}
        <Text style={[font.small, { color: p.muted }]}>
          Alerty od wyciszonych wydawców są nadal sprawdzane i zapisywane w historii, ale nie wywołują powiadomienia.
          Alerty o skrajnym zagrożeniu zawsze wywołują powiadomienie.
        </Text>
      </Card>

      <SectionTitle>Tryb pracy</SectionTitle>
      <Card>
        <Text style={[font.body, { color: p.text }]}>Telefon odbiera alerty z węzła.</Text>
        <Button title="Zmień tryb" variant="secondary" onPress={() => router.replace('/')} />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56 },
  flex: { flex: 1 },
});
