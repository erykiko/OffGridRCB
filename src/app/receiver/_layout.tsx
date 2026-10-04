import { Tabs } from 'expo-router/js-tabs';
import { AlertsProvider } from '../../alerts/AlertsContext';
import { usePalette } from '../../ui/theme';

// Receiver mode. AlertsProvider starts the listener on mount and stops it when the user leaves the mode.
// Text-only tabs: the active tab is a solid black block with white text.
export default function ReceiverLayout() {
  const p = usePalette();
  return (
    <AlertsProvider>
      <Tabs
        screenOptions={{
          headerStyle: { backgroundColor: p.card, borderBottomWidth: 2, borderBottomColor: p.border },
          headerTintColor: p.text,
          headerTitleStyle: { fontWeight: '800', fontSize: 20 },
          headerShadowVisible: false,
          tabBarStyle: { backgroundColor: p.card, borderTopWidth: 2, borderTopColor: p.border, height: 64 },
          tabBarIcon: () => null,
          tabBarIconStyle: { display: 'none' },
          tabBarLabelPosition: 'beside-icon',
          tabBarLabelStyle: { fontSize: 16, fontWeight: '700', marginLeft: 0 },
          tabBarItemStyle: { justifyContent: 'center' },
          tabBarActiveTintColor: p.onFill,
          tabBarActiveBackgroundColor: p.text,
          tabBarInactiveTintColor: p.text,
        }}
      >
        <Tabs.Screen name="index" options={{ title: 'Węzeł' }} />
        <Tabs.Screen name="history" options={{ title: 'Historia' }} />
        <Tabs.Screen name="settings" options={{ title: 'Ustawienia' }} />
      </Tabs>
    </AlertsProvider>
  );
}
