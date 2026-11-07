import { Tabs } from 'expo-router';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { palette } from '../Design/theme';

// Show four destinations for the active role while hiding the other role's tabs.
export default function MainTabs() {
  const { profile } = useAuth();
  const isClient = profile?.activeRole === 'client';
  return <Tabs screenOptions={{ headerShown: false, tabBarActiveTintColor: palette.primary, tabBarStyle: { backgroundColor: '#fff' } }}>
    <Tabs.Protected guard={isClient}>
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="jobs" options={{ title: 'My Jobs' }} />
    </Tabs.Protected>
    <Tabs.Protected guard={!isClient}>
      <Tabs.Screen name="feed" options={{ title: 'Feed' }} />
      <Tabs.Screen name="applications" options={{ title: 'Applications' }} />
    </Tabs.Protected>
    <Tabs.Screen name="chats" options={{ title: 'Chats' }} />
    <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
  </Tabs>;
}
