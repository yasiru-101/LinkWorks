import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const illustration = require('../../assets/images/login/workers-illustration.png');
const badge = require('../../assets/images/login/brand-badge.png');
const arrow = require('../../assets/images/login/arrow-right.png');
const statusIcons = require('../../assets/images/login/status-icons.png');

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const [frameWidth, setFrameWidth] = useState(Math.min(width, 390));
  const illustrationSectionHeight = (frameWidth * 360) / 390;

  return (
    <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'web' ? [] : ['top']}>
      <StatusBar style="dark" />
      <View
        onLayout={(event) => setFrameWidth(event.nativeEvent.layout.width)}
        style={[styles.frame, Platform.OS === 'web' && styles.webFrame]}>
        {Platform.OS === 'web' && (
          <View style={styles.webStatusBar}>
            <Text style={styles.webTime}>9:41</Text>
            <Image source={statusIcons} style={styles.statusIcons} />
          </View>
        )}

        <View style={[styles.illustrationWindow, { height: illustrationSectionHeight }]}>
          <Image
            accessibilityIgnoresInvertColors
            source={illustration}
            style={{ width: frameWidth, height: (frameWidth * 512) / 228 }}
          />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Image source={badge} style={styles.badge} />
            <Text style={styles.brandName}>
              <Text style={styles.brandLink}>Link</Text>
              <Text style={styles.brandWorks}>Works</Text>
            </Text>
            <Text style={styles.subtitle}>
              Sri Lanka&apos;s Skilled Trade &amp; Local Services{'\n'}Marketplace
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/phone', params: { mode: 'register' } })}
              style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
              <Text style={styles.primaryLabel}>Create Account</Text>
              <Image source={arrow} style={styles.arrow} />
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={() => router.push({ pathname: '/phone', params: { mode: 'login' } })}
              style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]}>
              <Text style={styles.secondaryLabel}>Log In</Text>
            </Pressable>

            <Text style={styles.terms}>
              By continuing, you agree to LinkWorks{' '}
              <Text onPress={() => router.push('/terms')} style={styles.termsLink}>
                Terms &amp; Conditions
              </Text>
              .
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Platform.OS === 'web' ? '#f3f4f6' : '#ffffff' },
  frame: { flex: 1, width: '100%', backgroundColor: '#ffffff', overflow: 'hidden' },
  webFrame: {
    alignSelf: 'center',
    width: 390,
    maxWidth: '100%',
    maxHeight: 884,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
  },
  webStatusBar: {
    height: 34.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
  },
  webTime: { color: '#091e19', fontFamily: 'Plus Jakarta Sans', fontWeight: '700', fontSize: 15 },
  statusIcons: { width: 64, height: 16 },
  illustrationWindow: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    justifyContent: 'flex-end',
    zIndex: 0,
  },
  scrollContent: { minHeight: 500, paddingBottom: 24, zIndex: 1 },
  header: { alignItems: 'center', marginTop: Platform.OS === 'web' ? 32 : 42 },
  badge: { width: 84, height: 84, borderRadius: 16, marginBottom: 24 },
  brandName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.75,
    lineHeight: 36,
    marginBottom: 10,
  },
  brandLink: { color: '#023e31' },
  brandWorks: { color: '#055b49' },
  subtitle: {
    color: '#4b635d',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 22.75,
    textAlign: 'center',
  },
  actions: { paddingHorizontal: 24, marginTop: 32, alignItems: 'stretch' },
  primaryButton: {
    height: 54.5,
    borderRadius: 100,
    backgroundColor: '#034e3f',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  primaryLabel: {
    color: '#ffffff',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22.5,
  },
  arrow: { width: 20, height: 20, marginLeft: 8 },
  secondaryButton: {
    height: 53,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#034e3f',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  secondaryLabel: {
    color: '#034e3f',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22.5,
  },
  terms: {
    color: '#556d67',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 19.5,
    textAlign: 'center',
    marginTop: 21,
    paddingHorizontal: 25,
  },
  termsLink: { color: '#034e3f', fontWeight: '600' },
  pressed: { opacity: 0.85 },
});
