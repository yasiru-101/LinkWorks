import { Tabs } from 'expo-router';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { palette } from '../Design/theme';

// Role-aware bottom tab bar matching LinkWorks Figma and mockup designs.
export default function MainTabs() {
  const { profile } = useAuth();
  const isClient = profile?.activeRole === 'client';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.primary,
        tabBarInactiveTintColor: '#8aa096',
        tabBarStyle: styles.tabBar,
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
    borderTopColor: '#e8f0ec',
    height: Platform.OS === 'ios' ? 86 : 64,
    paddingBottom: Platform.OS === 'ios' ? 26 : 8,
    paddingTop: 8,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBarLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxActive: {
    backgroundColor: '#eaf4f0',
  },
  iconText: {
    fontSize: 16,
  },
});
