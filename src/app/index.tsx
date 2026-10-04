import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { font, usePalette } from '../ui/theme';

function ModeOption({
  title,
  body,
  tone,
  onPress,
}: {
  title: string;
  body: string;
  tone: 'primary' | 'plain';
  onPress: () => void;
}) {
  const p = usePalette();
  const filled = tone === 'primary';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={body}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { borderColor: p.border, backgroundColor: filled ? p.primary : pressed ? p.tint : p.card },
        filled && pressed && { opacity: 0.85 },
      ]}
    >
      <Text style={[font.title, { color: filled ? p.onFill : p.text }]}>{title}</Text>
      <Text style={[font.body, { color: filled ? p.onFill : p.muted }]}>{body}</Text>
    </Pressable>
  );
}

// Shown on every launch: nothing listens or advertises until a mode is picked.
export default function ModePicker() {
  const p = usePalette();
  return (
    <SafeAreaView style={[styles.flex, { backgroundColor: p.bg }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[font.title, { color: p.text }]}>Off-grid RCB</Text>
          <Text style={[font.body, { color: p.muted }]}>Alerty od węzła w pobliżu, bez internetu i karty SIM.</Text>
        </View>
        <ModeOption
          tone="primary"
          title="Odbieraj alerty"
          body="Telefon łączy się z węzłem i pokazuje sprawdzone alerty."
          onPress={() => router.replace('/receiver')}
        />
        <ModeOption
          tone="plain"
          title="Nadajnik testowy"
          body="Telefon udaje węzeł i wysyła alerty podpisane publicznym kluczem testowym. Tylko do prób."
          onPress={() => router.replace('/sender')}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flex: 1, padding: 16, gap: 16, justifyContent: 'center' },
  header: { gap: 6, marginBottom: 8 },
  option: { borderWidth: 2, borderRadius: 4, padding: 20, gap: 8, minHeight: 120 },
});
