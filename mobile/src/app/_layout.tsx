import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { ActivityIndicator, Platform, Pressable, Text, useColorScheme, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../../../Yasiru/Auth/AuthContext';
import { ensureFirebaseApp } from '../../../Yasiru/Auth/firebase';

import { SearchCenterProvider } from '../../../Pasindu/Discovery/search-center';

// Gate routes from the server-loaded account state, while keeping Terms and initial entry public.
function ProtectedStack() {
  const { user, profile, workerReady, loading, error, refreshProfile, signOut } = useAuth();
  console.log('[LinkWorks Layout] ProtectedStack state:', { hasUser: !!user, hasProfile: !!profile, workerReady, loading, error });

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#034e3f" accessibilityLabel="Loading account" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', padding: 24, gap: 16 }}>
        <Text accessibilityRole="alert" style={{ textAlign: 'center', color: '#dc2626' }}>Could not load your account: {error}</Text>
        <Pressable accessibilityRole="button" onPress={() => { void refreshProfile(); }} style={{ padding: 12, backgroundColor: '#034e3f', borderRadius: 8 }}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>Retry</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => { void signOut(); }} style={{ padding: 8 }}>
          <Text style={{ color: '#6b7280' }}>Sign out</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Route 'index' is the app entry point and handles its own auth routing */}
      <Stack.Screen name="index" />
      <Stack.Screen name="terms" />

      <Stack.Protected guard={!user}>
        <Stack.Screen name="phone" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && !profile}>
        <Stack.Screen name="setup-profile" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && !!profile && (!profile.isWorker || workerReady)}>
        <Stack.Screen name="(main)" />
        <Stack.Screen name="post-job" options={{ presentation: 'modal' }} />
        <Stack.Screen name="job/[id]" />
        <Stack.Screen name="worker/[id]" />
        <Stack.Screen name="chat/[id]" />
      </Stack.Protected>

      <Stack.Protected guard={!!user && !!profile && profile.isWorker}>
        <Stack.Screen name="worker-setup" />
      </Stack.Protected>
    </Stack>
  );
}

// Ensure Android text measurement does not clip the trailing letter of bold or custom font text
if (Platform.OS === 'android') {
  const TextComponent = Text as any;
  if (TextComponent.defaultProps == null) {
    TextComponent.defaultProps = {};
  }
  TextComponent.defaultProps.textBreakStrategy = 'simple';
  TextComponent.defaultProps.includeFontPadding = false;
}

// Load static brand font variants once, then provide the native session to every route.
export default function RootLayout() {
  // Eagerly ensure Firebase default app instance is ready before auth listeners attach
  ensureFirebaseApp();

  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    'Plus Jakarta Sans': require('../../assets/fonts/PlusJakartaSans.ttf'),
  });

  // Display a clean white loading container while brand fonts initialize
  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#034e3f" accessibilityLabel="Loading LinkWorks" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <AuthProvider>
          <SearchCenterProvider>
            <ProtectedStack />
          </SearchCenterProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
