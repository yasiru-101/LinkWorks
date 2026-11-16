/**
 * LinkWorks Welcome & Landing Screen Component
 *
 * Framework path: `mobile/src/components/welcome-screen.tsx`
 * Owned by: Yasiru (Phone authentication, onboarding) & Bhashitha (Design system)
 *
 * First user-facing screen of LinkWorks:
 * 1. Full-screen brand visual: immersive deep-green canvas with decorative depth circles, code-drawn logo and tagline.
 * 2. Onboarding actions: high-contrast Create Account and Log In buttons leading to Phone OTP, plus Terms link.
 * 3. Auth state router: sends already signed-in users straight to their home, setup or worker setup.
 *
 * The screen is built only from Views and Text (no image files), so it renders the same on
 * Android, iOS and web and does not depend on bundled image assets.
 */

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../../Yasiru/Auth/AuthContext';

// Brand colours for this screen (deep green from the shared palette plus lighter tints for the hero).
const COLORS = {
  brand: '#034e3f',
  brandDark: '#023e31',
  brandSoft: '#e6f4ef',
  accent: '#34d399',
  background: '#f5faf8',
  surface: '#ffffff',
  heading: '#091e19',
  body: '#4b635d',
  border: '#d9e5df',
};

const FONT = 'Plus Jakarta Sans';

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile, workerReady, signOut } = useAuth();

  // Redirect signed-in users away from the welcome screen:
  // complete profile -> main tabs (worker feed or client home), worker without setup -> worker setup,
  // signed in but no profile yet -> profile setup.
  useEffect(() => {
    if (user && profile) {
      if (profile.isWorker && !workerReady) {
        router.replace('/worker-setup');
      } else {
        router.replace(profile.activeRole === 'worker' ? '/(main)/feed' : '/(main)/home');
      }
    } else if (user && !profile) {
      router.replace('/setup-profile');
    }
  }, [user, profile, workerReady]);

  // Both buttons open the phone OTP screen; mode decides the wording there.
  // A stale half-finished session is signed out first so the user starts cleanly.
  function openPhone(mode: 'register' | 'login') {
    if (user) {
      void signOut();
    }
    router.push({ pathname: '/phone', params: { mode } });
  }

  return (
    <View style={styles.root}>
      {/* Light status bar icons sit on top of the full-screen deep green background. */}
      <StatusBar style="light" />
      <View style={[styles.frame, Platform.OS === 'web' && styles.webFrame]}>
        {/* Soft decorative background circles give the full-screen green canvas depth. */}
        <View pointerEvents="none" style={[styles.circle, styles.circleLarge]} />
        <View pointerEvents="none" style={[styles.circle, styles.circleMid]} />
        <View pointerEvents="none" style={[styles.circle, styles.circleSmall]} />

        {/* ScrollView allows the layout to adapt gracefully to various screen heights. */}
        <ScrollView bounces={false} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Brand presentation: logo, brand name, tagline and trust pill. */}
          <View style={[styles.hero, { paddingTop: insets.top + 48 }]}>
            {/* Logo mark drawn in code: white rounded tile with a green "L" and a link dot. */}
            <View style={styles.logoTile}>
              <Text style={styles.logoLetter}>L</Text>
              <View style={styles.logoDot} />
            </View>

            <Text style={styles.brandName}>
              Link<Text style={styles.brandAccent}>Works</Text>
            </Text>
            <Text style={styles.tagline}>{"Sri Lanka's marketplace for skilled trades and local services"}</Text>

            <View style={styles.pill}>
              <View style={styles.pillDot} />
              <Text style={styles.pillText}>Trusted local workers, one tap away</Text>
            </View>
          </View>

          {/* Spacer pushes the actions to the bottom when the screen has spare height. */}
          <View style={styles.spacer} />

          {/* Actions: primary Create Account, secondary Log In, then the Terms notice. */}
          <View style={[styles.actions, { paddingBottom: Math.max(insets.bottom, 16) + 12 }]}>
            <Pressable
              accessibilityRole="button"
              onPress={() => openPhone('register')}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryLabel}>Create Account</Text>
              <Text style={styles.primaryArrow}>→</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => openPhone('login')}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryLabel}>Log In</Text>
            </Pressable>

            <Text style={styles.terms}>
              {'By continuing, you agree to the LinkWorks '}
              <Text accessibilityRole="link" onPress={() => router.push('/terms')} style={styles.termsLink}>
                {'Terms & Conditions'}
              </Text>
              {'.'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Full-screen deep green background across native and web viewport.
  root: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#022921' : COLORS.brand },
  frame: { flex: 1, width: '100%', backgroundColor: COLORS.brand, overflow: 'hidden' },
  webFrame: { alignSelf: 'center', maxWidth: 430 },
  scrollContent: { flexGrow: 1 },

  // Brand presentation container
  hero: {
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  circle: { position: 'absolute', borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.05)' },
  circleLarge: { width: 340, height: 340, top: -100, right: -120 },
  circleMid: { width: 200, height: 200, top: '48%', left: -80 },
  circleSmall: { width: 240, height: 240, bottom: -60, right: -70 },
  logoTile: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoLetter: { fontFamily: FONT, fontSize: 40, fontWeight: '800', color: COLORS.brand, lineHeight: 48 },
  logoDot: {
    position: 'absolute',
    right: 16,
    bottom: 18,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  brandName: { fontFamily: FONT, fontSize: 34, fontWeight: '800', color: COLORS.surface, letterSpacing: -0.5, lineHeight: 42 },
  brandAccent: { fontFamily: FONT, color: COLORS.accent },
  tagline: {
    fontFamily: FONT,
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    maxWidth: 300,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  pillDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.accent, marginRight: 8 },
  pillText: { fontFamily: FONT, fontSize: 12, fontWeight: '600', color: COLORS.surface, paddingRight: 2 },

  spacer: { flex: 1, minHeight: 48 },

  // Actions
  actions: { paddingHorizontal: 20 },
  primaryButton: {
    height: 56,
    borderRadius: 999,
    backgroundColor: COLORS.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryLabel: { fontFamily: FONT, fontSize: 16, fontWeight: '700', color: COLORS.brand, paddingHorizontal: 2 },
  primaryArrow: { fontFamily: FONT, fontSize: 18, fontWeight: '700', color: COLORS.brand, marginLeft: 8 },
  secondaryButton: {
    height: 54,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  secondaryLabel: { fontFamily: FONT, fontSize: 15, fontWeight: '700', color: COLORS.surface, paddingHorizontal: 2 },
  terms: {
    fontFamily: FONT,
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
  },
  termsLink: { fontFamily: FONT, color: COLORS.surface, fontWeight: '700', textDecorationLine: 'underline' },
  pressed: { opacity: 0.85 },
});
