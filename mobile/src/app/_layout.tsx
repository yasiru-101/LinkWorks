import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { ActivityIndicator, Pressable, Text, useColorScheme, View } from 'react-native';
import { AuthProvider, useAuth } from '../../../Yasiru/Auth/AuthContext';

// Gate routes from the server-loaded account state, while keeping Terms public.
function ProtectedStack() {
  const { user, profile, workerReady, loading, error, refreshProfile, signOut } = useAuth();
  if (loading) return <View style={{ flex: 1, justifyContent: 'center' }}><ActivityIndicator accessibilityLabel="Loading account" /></View>;
  if (error) return <View style={{ flex: 1, justifyContent: 'center', padding: 24, gap: 16 }}>
    <Text accessibilityRole="alert">Could not load your account: {error}</Text>
    <Pressable accessibilityRole="button" onPress={() => { void refreshProfile(); }}><Text>Retry</Text></Pressable>
    <Pressable accessibilityRole="button" onPress={() => { void signOut(); }}><Text>Sign out</Text></Pressable>
  </View>;

  return <Stack screenOptions={{ headerShown: false }}>
    <Stack.Protected guard={!user}>
      <Stack.Screen name="index" />
      <Stack.Screen name="phone" />
    </Stack.Protected>
    <Stack.Protected guard={!!user && !profile}>
      <Stack.Screen name="setup-profile" />
    </Stack.Protected>
    <Stack.Protected guard={!!user && !!profile && profile.isWorker && !workerReady}>
      <Stack.Screen name="worker-setup" />
    </Stack.Protected>
    <Stack.Protected guard={!!user && !!profile && (!profile.isWorker || workerReady)}>
      <Stack.Screen name="(main)" />
    </Stack.Protected>
    <Stack.Screen name="terms" />
  </Stack>;
}

// Load the brand font once, then provide the native session to every route.
export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'Plus Jakarta Sans': require('../../assets/fonts/PlusJakartaSans.ttf'),
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AuthProvider><ProtectedStack /></AuthProvider>
    </ThemeProvider>
  );
}
