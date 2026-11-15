import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { palette } from '../Design/theme';

// Role-aware bottom tab bar matching LinkWorks Figma and mockup designs.
// Dynamically adjusts height and padding based on hardware safe area insets to prevent Android navigation bar overlap.
export default function MainTabs() {
  const { profile } = useAuth();
  const isClient = profile?.activeRole === 'client';
  const insets = useSafeAreaInsets();

  // Dynamic bottom inset to safely raise navigation bar above Android 3-button hardware bar or iOS home indicator.
  // On Android with 3-button navigation (◀ ● ■), the system bar is 48-56dp tall.
  // When insets.bottom is 0 (safe area not propagated) or even when present, we enforce at least 68dp on Android
  // (or insets.bottom + 16dp) so tab bar icons and labels are elevated clearly and comfortably above the system buttons.
  const bottomInset = Platform.OS === 'android'
    ? Math.max(insets.bottom + 16, 68)
    : Math.max(insets.bottom, 12);
  const tabHeight = 62 + bottomInset;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: '#476358',
        tabBarStyle: [
          styles.tabBar,
          {
            height: tabHeight,
            paddingBottom: bottomInset,
          },
        ],
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      {/* Client Destinations */}
      <Tabs.Protected guard={isClient}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Discover',
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
                <Text style={styles.iconText}>🔍</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: 'My Jobs',
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
                <Text style={styles.iconText}>📋</Text>
              </View>
            ),
          }}
        />
      </Tabs.Protected>

      {/* Worker Destinations */}
      <Tabs.Protected guard={!isClient}>
        <Tabs.Screen
          name="feed"
          options={{
            title: 'Job Feed',
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
                <Text style={styles.iconText}>⚡</Text>
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="applications"
          options={{
            title: 'My Quotes',
            tabBarIcon: ({ focused }) => (
              <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
                <Text style={styles.iconText}>📝</Text>
              </View>
            ),
          }}
        />
      </Tabs.Protected>

      {/* Shared Destinations */}
      <Tabs.Screen
        name="chats"
        options={{
          title: 'Messages',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Text style={styles.iconText}>💬</Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconBox, focused && styles.iconBoxActive]}>
              <Text style={styles.iconText}>👤</Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5ece8',
    paddingTop: 8,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 12,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    paddingRight: 4,
  },
  iconBox: {
    width: 36,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: '#e8f5ee',
  },
  iconText: {
    fontSize: 16,
  },
});
