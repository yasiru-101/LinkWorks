/**
 * LinkWorks Phone Authentication & OTP Verification Screen
 * 
 * Owner: Yasiru (Phone authentication, onboarding, account and worker setup, role context, settings)
 * 
 * This screen handles telephone onboarding and sign-in for the LinkWorks mobile application:
 * 1. Accepts Sri Lankan phone numbers formatted as local (077 123 4567) or international (+94 77 123 4567).
 * 2. Triggers Google Play Integrity and native SMS verification via `signInWithPhoneNumber`.
 * 3. Renders a high-fidelity 6-box visual OTP input with cursor pulsation and auto-advance.
 * 4. Automatically submits verification once all 6 digits are typed.
 * 5. Provides a 60-second countdown cooldown for SMS resends.
 */

import { signInWithPhoneNumber } from '@react-native-firebase/auth';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '../../Bhashitha/Design/theme';
import { useAuth } from './AuthContext';
import { getSafeAuth } from './firebase';

// Load brand identity assets from the shared mobile login assets.
const arrow = require('../../mobile/assets/images/login/arrow-right.png');
const badge = require('../../mobile/assets/images/login/brand-badge.png');
const statusIcons = require('../../mobile/assets/images/login/status-icons.png');

type Confirmation = {
  confirm: (verificationCode: string) => Promise<any>;
};

// Normalize and validate Sri Lankan (+94) or standard international phone numbers.
function normalizePhone(input: string): string {
  let cleaned = input.replace(/[\s()-]/g, '');
  // If the user entered a local Sri Lankan mobile number starting with 0 (e.g. 0771234567), convert to +94
  if (/^0\d{9}$/.test(cleaned)) {
    cleaned = '+94' + cleaned.substring(1);
  } else if (/^\d{9}$/.test(cleaned)) {
    // If entered without leading 0 or + (e.g. 771234567)
    cleaned = '+94' + cleaned;
  } else if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }

  if (!/^\+[1-9]\d{7,14}$/.test(cleaned)) {
    throw new Error('Please enter a valid phone number, such as +94 77 123 4567 or 0771234567.');
  }
  return cleaned;
}

// Phone entry and high-fidelity 6-digit OTP verification screen using pure Firebase Auth.
export default function PhoneScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { width } = useWindowDimensions();
  const { user, profile, workerReady, signOut } = useAuth();

  // If entering registration mode with an existing session, sign out to ensure a fresh onboarding experience.
  useEffect(() => {
    if (mode === 'register' && user && profile) {
      void signOut();
    }
  }, [mode, user, profile, signOut]);

  // Navigation watcher: advance the user to setup or main tabs as soon as authenticated in Firebase.
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

  // Form states for phone input and OTP confirmation steps.
  const [phone, setPhone] = useState('+94 ');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  // Reference to the hidden native text input controlling the 6 OTP digit boxes.
  const otpInputRef = useRef<TextInput>(null);

  // Subtle pulse animation for the active cursor on the focused OTP cell.
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, { toValue: 0.1, duration: 500, useNativeDriver: true }),
        Animated.timing(cursorOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [cursorOpacity]);

  // Countdown timer effect that ticks down every second for the resend code cooldown.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((sec) => sec - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Send verification code directly via pure Firebase Phone Auth.
  async function requestCode() {
    try {
      const normalized = normalizePhone(phone);
      setBusy(true);
      setIsError(false);
      setMessage('Requesting verification code…');

      // Request OTP from Firebase Auth
      const result = await signInWithPhoneNumber(getSafeAuth(), normalized);

      setConfirmation(result);
      setCooldown(60);
      setMessage('Verification code sent. Enter the 6-digit code below.');
      // Auto-focus the OTP input once code has been sent
      setTimeout(() => otpInputRef.current?.focus(), 300);
    } catch (cause) {
      setIsError(true);
      const raw = cause instanceof Error ? cause.message : String(cause);
      setMessage(raw);
    } finally {
      setBusy(false);
    }
  }

  // Verify the entered 6-digit code against the active Firebase confirmation session.
  async function confirmCode(codeToVerify?: string) {
    const finalCode = (codeToVerify ?? code).trim();
    if (!confirmation || !/^\d{6}$/.test(finalCode)) {
      setIsError(true);
      setMessage('Please enter all 6 digits of the verification code.');
      return;
    }

    try {
      setBusy(true);
      setIsError(false);
      setMessage('Verifying your code with Firebase…');
      await confirmation.confirm(finalCode);
      setMessage('Phone verified! Loading your LinkWorks account…');
    } catch (cause) {
      setIsError(true);
      const raw = cause instanceof Error ? cause.message : String(cause);
      setMessage(raw);
    } finally {
      setBusy(false);
    }
  }

  // Handle OTP digit changes and automatically submit once all 6 digits are typed.
  function handleCodeChange(value: string) {
    const cleanDigits = value.replace(/\D/g, '').slice(0, 6);
    setCode(cleanDigits);
    if (cleanDigits.length === 6) {
      void confirmCode(cleanDigits);
    }
  }

  // Switch back to the phone number editing step so user can correct typos.
  function handleEditPhone() {
    setConfirmation(null);
    setCode('');
    setMessage('');
    setIsError(false);
  }

  // Responsive frame sizing for web and tablet viewports.
  const isWeb = Platform.OS === 'web';
  const containerMaxWidth = Math.min(width, 420);

  return (
    <SafeAreaView style={styles.safeArea} edges={isWeb ? [] : ['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoid}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.frame, isWeb && styles.webFrame, { maxWidth: containerMaxWidth }]}>
            {/* Web Status Bar Simulation */}
            {isWeb && (
              <View style={styles.webStatusBar}>
                <Text style={styles.webTime}>9:41</Text>
                <Image source={statusIcons} style={styles.statusIcons} />
              </View>
            )}

            {/* Top Navigation Row */}
            <View style={styles.topBar}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Go back"
                onPress={() => (confirmation ? handleEditPhone() : router.back())}
                style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
              >
                <Text style={styles.backButtonText}>←</Text>
              </Pressable>
              <Image source={badge} style={styles.headerBadge} />
              <View style={styles.topBarPlaceholder} />
            </View>

            {/* Header Title Section */}
            <View style={styles.headerSection}>
              <Text style={styles.title}>
                {confirmation ? 'Enter verification code' : mode === 'register' ? 'Create Account' : 'Welcome Back'}
              </Text>
              <Text style={styles.subtitle}>
                {confirmation ? (
                  <>
                    We sent a 6-digit code to{' '}
                    <Text style={styles.phoneHighlight}>{phone.trim()}</Text>
                  </>
                ) : (
                  'Enter your phone number to sign in or create your LinkWorks profile'
                )}
              </Text>
              {confirmation && (
                <Pressable onPress={handleEditPhone} style={styles.editPhoneRow}>
                  <Text style={styles.editPhoneLink}>Change phone number</Text>
                </Pressable>
              )}
            </View>

            {/* Main Form Section */}
            {!confirmation ? (
              /* Step 1: Phone Number Entry */
              <View style={styles.formCard}>
                <Text style={styles.fieldLabel}>Mobile Phone Number</Text>
                <View style={styles.phoneInputRow}>
                  <View style={styles.countryCodePill}>
                    <Text style={styles.flagEmoji}>🇱🇰</Text>
                    <Text style={styles.countryCodeText}>+94</Text>
                  </View>
                  <TextInput
                    accessibilityLabel="Phone number"
                    autoComplete="tel"
                    keyboardType="phone-pad"
                    placeholder="77 123 4567"
                    placeholderTextColor="#8ea29b"
                    value={phone.startsWith('+94') ? phone.replace('+94', '').trimStart() : phone}
                    onChangeText={(val) => {
                      const digits = val.replace(/\D/g, '');
                      setPhone('+94 ' + digits);
                    }}
                    editable={!busy}
                    style={styles.phoneTextInput}
                  />
                </View>

                {/* Primary Action: Send Code */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Send verification code"
                  onPress={() => { void requestCode(); }}
                  disabled={busy}
                  style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed, busy && styles.disabled]}
                >
                  {busy ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Send Verification Code</Text>
                      <Image source={arrow} style={styles.arrowIcon} />
                    </>
                  )}
                </Pressable>

                {/* Convenient helper for developer / Firebase test phone number */}
                <Pressable
                  onPress={() => setPhone('+94 77 123 4567')}
                  style={styles.fillTestPhoneButton}
                >
                  <Text style={styles.fillTestPhoneText}>Use Test Phone (+94 77 123 4567)</Text>
                </Pressable>
              </View>
            ) : (
              /* Step 2: 6-Digit OTP Verification Entry */
              <View style={styles.formCard}>
                <Text style={styles.fieldLabel}>6-Digit Code</Text>

                {/* Visual 6-box OTP Display */}
                <Pressable
                  onPress={() => otpInputRef.current?.focus()}
                  style={styles.otpBoxesContainer}
                  accessibilityRole="button"
                  accessibilityLabel="Verification code input"
                >
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const digit = code[index] || '';
                    const isFocused = code.length === index;
                    const isFilled = digit !== '';
                    return (
                      <View
                        key={index}
                        style={[
                          styles.otpBox,
                          isFocused && styles.otpBoxFocused,
                          isFilled && styles.otpBoxFilled,
                          isError && styles.otpBoxError,
                        ]}
                      >
                        {digit ? (
                          <Text style={styles.otpDigit}>{digit}</Text>
                        ) : isFocused ? (
                          <Animated.View style={[styles.cursor, { opacity: cursorOpacity }]} />
                        ) : null}
                      </View>
                    );
                  })}
                </Pressable>

                {/* Hidden Native Input Capturing Keyboard Events & SMS Autofill */}
                <TextInput
                  ref={otpInputRef}
                  value={code}
                  onChangeText={handleCodeChange}
                  keyboardType="number-pad"
                  maxLength={6}
                  textContentType="oneTimeCode"
                  autoComplete="sms-otp"
                  style={styles.hiddenInput}
                  autoFocus
                />

                {/* Resend Code Section & Countdown */}
                <View style={styles.resendSection}>
                  <Text style={styles.resendText}>Didn’t receive the code? </Text>
                  {cooldown > 0 ? (
                    <Text style={styles.cooldownTimer}>
                      Resend in 0:{cooldown < 10 ? `0${cooldown}` : cooldown}
                    </Text>
                  ) : (
                    <Pressable onPress={() => { void requestCode(); }} disabled={busy}>
                      <Text style={styles.resendAction}>Resend Code</Text>
                    </Pressable>
                  )}
                </View>

                {/* Primary Action: Verify & Continue */}
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Verify and continue"
                  onPress={() => { void confirmCode(); }}
                  disabled={busy || code.length < 6}
                  style={({ pressed }) => [
                    styles.primaryButton,
                    (busy || code.length < 6) && styles.disabled,
                    pressed && styles.pressed,
                  ]}
                >
                  {busy ? (
                    <ActivityIndicator color="#ffffff" />
                  ) : (
                    <>
                      <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                      <Image source={arrow} style={styles.arrowIcon} />
                    </>
                  )}
                </Pressable>
              </View>
            )}

            {/* Status & Error Feedback Message */}
            {message ? (
              <View style={[styles.messageBanner, isError ? styles.errorBanner : styles.infoBanner]}>
                <Text style={styles.messageIcon}>{isError ? '⚠️' : 'ℹ️'}</Text>
                <Text style={[styles.messageText, isError ? styles.errorText : styles.infoText]}>
                  {message}
                </Text>
              </View>
            ) : null}

            {/* Security & Trust Footer */}
            <View style={styles.trustFooter}>
              <Text style={styles.shieldIcon}>🛡️</Text>
              <Text style={styles.trustText}>
                Your phone number is authenticated via Firebase security. We never share your contact details publicly.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  frame: {
    width: '100%',
    alignSelf: 'center',
  },
  webFrame: {
    marginTop: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.08,
    shadowRadius: 32,
    borderWidth: 1,
    borderColor: '#e8f0ec',
  },
  webStatusBar: {
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  webTime: {
    color: '#091e19',
    fontFamily: 'Plus Jakarta Sans',
    fontWeight: '700',
    fontSize: 14,
  },
  statusIcons: {
    width: 60,
    height: 15,
    resizeMode: 'contain',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Platform.OS === 'web' ? 8 : 16,
    marginBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eaf4f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
    color: palette.primary,
    fontWeight: '700',
    lineHeight: 24,
  },
  headerBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  topBarPlaceholder: {
    width: 44,
  },
  headerSection: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 26,
    fontWeight: '800',
    color: palette.heading,
    letterSpacing: -0.5,
    lineHeight: 34,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: palette.muted,
    lineHeight: 21,
  },
  phoneHighlight: {
    fontWeight: '700',
    color: palette.heading,
  },
  editPhoneRow: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  editPhoneLink: {
    color: palette.primary,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e2ece7',
    padding: 20,
    marginBottom: 16,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
    elevation: 2,
  },
  fieldLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.heading,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#d2e2db',
    borderRadius: 14,
    backgroundColor: '#fbfdfc',
    marginBottom: 18,
    overflow: 'hidden',
  },
  countryCodePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#f0f7f4',
    borderRightWidth: 1,
    borderRightColor: '#d2e2db',
    gap: 6,
  },
  flagEmoji: {
    fontSize: 18,
  },
  countryCodeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    color: palette.heading,
  },
  phoneTextInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '600',
    color: palette.heading,
  },
  fillTestPhoneButton: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 6,
  },
  fillTestPhoneText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '600',
    color: palette.primary,
  },
  otpBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 4,
  },
  otpBox: {
    width: 44,
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#d0dfd8',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  otpBoxFocused: {
    borderColor: palette.primary,
    backgroundColor: '#f2f9f6',
    borderWidth: 2,
  },
  otpBoxFilled: {
    borderColor: '#046c57',
    backgroundColor: '#ffffff',
  },
  otpBoxError: {
    borderColor: palette.danger,
  },
  otpDigit: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 22,
    fontWeight: '800',
    color: palette.heading,
  },
  cursor: {
    width: 2,
    height: 24,
    backgroundColor: palette.primary,
    borderRadius: 1,
  },
  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
  resendSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  resendText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: palette.muted,
  },
  cooldownTimer: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
  },
  resendAction: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
    textDecorationLine: 'underline',
  },
  primaryButton: {
    height: 52,
    borderRadius: 100,
    backgroundColor: palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
  },
  primaryButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  arrowIcon: {
    width: 18,
    height: 18,
    marginLeft: 8,
    resizeMode: 'contain',
    tintColor: '#ffffff',
  },
  messageBanner: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    gap: 10,
    alignItems: 'flex-start',
  },
  infoBanner: {
    backgroundColor: '#edf7f3',
    borderWidth: 1,
    borderColor: '#c6e7d9',
  },
  errorBanner: {
    backgroundColor: '#fef3f2',
    borderWidth: 1,
    borderColor: '#fee4e2',
  },
  messageIcon: {
    fontSize: 16,
    lineHeight: 20,
  },
  messageText: {
    flex: 1,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    lineHeight: 19,
  },
  infoText: {
    color: '#065f46',
  },
  errorText: {
    color: '#b42318',
  },
  trustFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 10,
    marginTop: 8,
  },
  shieldIcon: {
    fontSize: 18,
  },
  trustText: {
    flex: 1,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#657e76',
    lineHeight: 16,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
  },
});
