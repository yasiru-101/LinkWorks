import { getAuth, signInWithPhoneNumber } from '@react-native-firebase/auth';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Action, Card, Field, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette } from '../../Bhashitha/Design/theme';

type Confirmation = Awaited<ReturnType<typeof signInWithPhoneNumber>>;

// Send a verification request only for plausible international phone numbers.
function normalizePhone(input: string): string {
  const phone = input.replace(/[\s()-]/g, '');
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) throw new Error('Enter a phone number with country code, such as +94771234567.');
  return phone;
}

// Separate phone entry and six-digit confirmation from profile onboarding.
export default function PhoneScreen() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  // Count down the resend interval while the code entry step is visible.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  // Firebase sends an SMS or accepts a fictional test number configured in the console.
  async function requestCode() {
    try {
      const normalized = normalizePhone(phone);
      setBusy(true);
      setError(false);
      setMessage('Requesting a verification code…');
      const result = await signInWithPhoneNumber(getAuth(), normalized);
      setConfirmation(result);
      setCooldown(60);
      setMessage('Enter the code sent to your phone.');
    } catch (cause) {
      setError(true);
      setMessage(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  // The auth listener moves the user to account setup or the protected tabs on success.
  async function confirmCode() {
    if (!confirmation || !/^\d{6}$/.test(code.trim())) {
      setError(true);
      setMessage('Enter the six-digit verification code.');
      return;
    }
    try {
      setBusy(true);
      setError(false);
      setMessage('Verifying your code…');
      await confirmation.confirm(code.trim());
      setCode('');
      setMessage('Phone verified. Loading your account…');
    } catch (cause) {
      setError(true);
      setMessage(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  return <Page>
    <Action label="Back" secondary onPress={() => router.back()} />
    <Text style={styles.title}>{mode === 'register' ? 'Create Account' : 'Log In'}</Text>
    <Text style={styles.subtitle}>Continue with your phone number</Text>
    <Card title={confirmation ? 'Enter verification code' : 'Your phone number'}>
      <Field label="Phone number" keyboardType="phone-pad" autoComplete="tel" placeholder="+94771234567" value={phone} onChangeText={setPhone} editable={!busy} />
      <Action label={confirmation ? `Resend code${cooldown ? ` in ${cooldown}s` : ''}` : 'Send code'} onPress={() => { void requestCode(); }} disabled={cooldown > 0} busy={busy && !confirmation} />
      {confirmation ? <>
        <Field label="Verification code" keyboardType="number-pad" autoComplete="sms-otp" maxLength={6} placeholder="Six-digit code" value={code} onChangeText={setCode} editable={!busy} />
        <Action label="Verify and continue" onPress={() => { void confirmCode(); }} busy={busy} />
      </> : null}
    </Card>
    {message ? <Status message={message} error={error} /> : null}
  </Page>;
}

const styles = StyleSheet.create({
  title: { color: palette.heading, fontFamily: 'Plus Jakarta Sans', fontSize: 30, fontWeight: '800' },
  subtitle: { color: palette.muted, fontSize: 16 },
});
