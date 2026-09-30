import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithPhoneNumber,
  signOut,
} from '@react-native-firebase/auth';
import {
  doc,
  getDocFromServer,
  getFirestore,
  serverTimestamp,
  setDoc,
} from '@react-native-firebase/firestore';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Confirmation = Awaited<ReturnType<typeof signInWithPhoneNumber>>;
type SignedInUser = NonNullable<ReturnType<typeof getAuth>['currentUser']>;

const projectId = getApp().options.projectId ?? 'unknown';

function describeError(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export default function HomeScreen() {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<SignedInUser | null>(null);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [isClient, setIsClient] = useState(true);
  const [isWorker, setIsWorker] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    let active = true;
    const unsubscribe = onAuthStateChanged(getAuth(), async (nextUser) => {
      if (!active) return;
      setUser(nextUser);
      setAuthReady(true);
      setConfirmation(null);
      setMessage(nextUser ? 'Signed in. Checking your Firestore profile…' : 'Ready to sign in.');

      if (!nextUser) return;
      try {
        const snapshot = await getDocFromServer(doc(getFirestore(), 'users', nextUser.uid));
        if (!active || getAuth().currentUser?.uid !== nextUser.uid) return;
        if (snapshot.exists()) {
          const profile = snapshot.data();
          setName(typeof profile?.name === 'string' ? profile.name : '');
          setCity(typeof profile?.city === 'string' ? profile.city : '');
          setIsClient(profile?.isClient === true);
          setIsWorker(profile?.isWorker === true);
          setMessage('Connected to Firestore. Your profile was loaded from the server.');
        } else {
          setMessage('Connected to Firestore. Complete your new profile below.');
        }
      } catch (error) {
        if (active) setMessage(`Firestore read failed: ${describeError(error)}`);
      }
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function sendCode() {
    const normalizedPhone = phone.replace(/[\s()-]/g, '');
    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setMessage('Enter a phone number with country code, such as +94771234567.');
      return;
    }
    setBusy(true);
    setMessage('Requesting a verification code…');
    try {
      const result = await signInWithPhoneNumber(getAuth(), normalizedPhone);
      setConfirmation(result);
      setMessage('Code requested. Enter the SMS code or your Firebase test code.');
    } catch (error) {
      setMessage(`Could not send code: ${describeError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode() {
    if (!confirmation || !/^\d{6}$/.test(code.trim())) {
      setMessage('Enter the six-digit verification code.');
      return;
    }
    setBusy(true);
    setMessage('Confirming code…');
    try {
      await confirmation.confirm(code.trim());
      setCode('');
      setMessage('Phone verified. Loading your profile…');
    } catch (error) {
      setMessage(`Verification failed: ${describeError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile() {
    if (!user) return;
    const cleanName = name.trim();
    const cleanCity = city.trim();
    if (!cleanName || !cleanCity || (!isClient && !isWorker)) {
      setMessage('Enter your name and city, then select at least one role.');
      return;
    }
    setBusy(true);
    setMessage('Saving your profile…');
    try {
      const reference = doc(getFirestore(), 'users', user.uid);
      const existing = await getDocFromServer(reference);
      await setDoc(
        reference,
        {
          name: cleanName,
          phone: user.phoneNumber ?? '',
          city: cleanCity,
          isClient,
          isWorker,
          updatedAt: serverTimestamp(),
          ...(existing.exists() ? {} : { createdAt: serverTimestamp() }),
        },
        { merge: true },
      );
      const verified = await getDocFromServer(reference);
      setMessage(
        verified.exists()
          ? 'Profile saved and read back from Firestore.'
          : 'Save completed, but the profile could not be read back.',
      );
    } catch (error) {
      setMessage(`Profile save failed: ${describeError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  async function handleSignOut() {
    setBusy(true);
    try {
      await signOut(getAuth());
      setName('');
      setCity('');
      setCode('');
    } catch (error) {
      setMessage(`Sign-out failed: ${describeError(error)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>LINKWORKS</Text>
        <Text style={styles.title}>Firebase foundation</Text>
        <Text style={styles.subtitle}>Android sign-in and profile setup</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Firebase project</Text>
          <Text style={styles.value}>{projectId}</Text>
          <Text style={styles.help}>Native configuration loaded. Sign in to test Firestore access.</Text>
        </View>

        {!authReady ? (
          <ActivityIndicator accessibilityLabel="Checking sign-in state" />
        ) : user ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your profile</Text>
            <Text style={styles.help}>Signed in as {user.phoneNumber ?? user.uid}</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              accessibilityLabel="Name"
              autoCapitalize="words"
              onChangeText={setName}
              placeholder="Your name"
              style={styles.input}
              value={name}
            />
            <Text style={styles.label}>City</Text>
            <TextInput
              accessibilityLabel="City"
              autoCapitalize="words"
              onChangeText={setCity}
              placeholder="Your city"
              style={styles.input}
              value={city}
            />
            <View style={styles.roleRow}>
              <Text style={styles.roleLabel}>I hire workers</Text>
              <Switch accessibilityLabel="Client role" onValueChange={setIsClient} value={isClient} />
            </View>
            <View style={styles.roleRow}>
              <Text style={styles.roleLabel}>I offer services</Text>
              <Switch accessibilityLabel="Worker role" onValueChange={setIsWorker} value={isWorker} />
            </View>
            <Pressable disabled={busy} onPress={saveProfile} style={styles.button}>
              <Text style={styles.buttonText}>Save profile</Text>
            </Pressable>
            <Pressable disabled={busy} onPress={handleSignOut} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Sign out</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sign in with your phone</Text>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              accessibilityLabel="Phone number"
              autoComplete="tel"
              keyboardType="phone-pad"
              onChangeText={setPhone}
              placeholder="+94771234567"
              style={styles.input}
              value={phone}
            />
            <Pressable disabled={busy} onPress={sendCode} style={styles.button}>
              <Text style={styles.buttonText}>{confirmation ? 'Send another code' : 'Send code'}</Text>
            </Pressable>
            {confirmation && (
              <>
                <Text style={styles.label}>Verification code</Text>
                <TextInput
                  accessibilityLabel="Verification code"
                  autoComplete="sms-otp"
                  keyboardType="number-pad"
                  maxLength={6}
                  onChangeText={setCode}
                  placeholder="Six-digit code"
                  style={styles.input}
                  value={code}
                />
                <Pressable disabled={busy} onPress={confirmCode} style={styles.button}>
                  <Text style={styles.buttonText}>Verify and sign in</Text>
                </Pressable>
              </>
            )}
          </View>
        )}

        {busy && <ActivityIndicator accessibilityLabel="Working" />}
        <Text accessibilityLiveRegion="polite" style={styles.status}>{message}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f3f6fa' },
  content: { padding: 24, gap: 18, paddingBottom: 48 },
  eyebrow: { color: '#17644b', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#17212b', fontSize: 30, fontWeight: '700' },
  subtitle: { color: '#52616f', fontSize: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 10 },
  sectionTitle: { color: '#17212b', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  label: { color: '#344454', fontSize: 14, fontWeight: '600' },
  value: { color: '#17212b', fontSize: 17, fontWeight: '600' },
  help: { color: '#617181', fontSize: 13, lineHeight: 19 },
  input: { borderColor: '#cbd5df', borderRadius: 10, borderWidth: 1, padding: 12, fontSize: 16 },
  roleRow: { alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' },
  roleLabel: { color: '#17212b', fontSize: 16 },
  button: { alignItems: 'center', backgroundColor: '#17644b', borderRadius: 10, padding: 14 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', padding: 10 },
  secondaryButtonText: { color: '#17644b', fontSize: 15, fontWeight: '600' },
  status: { color: '#344454', fontSize: 14, lineHeight: 20 },
});
