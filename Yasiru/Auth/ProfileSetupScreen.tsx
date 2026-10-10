import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { Action, Card, Field, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette } from '../../Bhashitha/Design/theme';
import { useAuth } from './AuthContext';

// Save the minimum private account information before opening marketplace tabs.
export default function ProfileSetupScreen() {
  const { user, profile, saveProfile, signOut } = useAuth();
  const [name, setName] = useState(profile?.name ?? '');
  const [city, setCity] = useState(profile?.city ?? '');
  const [isClient, setIsClient] = useState(profile?.isClient ?? true);
  const [isWorker, setIsWorker] = useState(profile?.isWorker ?? false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // The provider writes the account, reads it back, and updates the protected route guard.
  async function save() {
    try {
      setBusy(true);
      setError('');
      await saveProfile({ name, city, isClient, isWorker });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  return <Page>
    <Text style={styles.title}>Complete your profile</Text>
    <Text style={styles.help}>Signed in as {user?.phoneNumber ?? 'your verified phone'}</Text>
    <Card title="About you">
      <Field label="Name" autoCapitalize="words" value={name} onChangeText={setName} placeholder="Your name" />
      <Field label="City" autoCapitalize="words" value={city} onChangeText={setCity} placeholder="Your city" />
      <View style={styles.role}><Text style={styles.roleText}>I hire workers</Text><Switch accessibilityLabel="Client role" value={isClient} onValueChange={setIsClient} /></View>
      <View style={styles.role}><Text style={styles.roleText}>I offer services</Text><Switch accessibilityLabel="Worker role" value={isWorker} onValueChange={setIsWorker} /></View>
      <Action label="Save and continue" onPress={() => { void save(); }} busy={busy} />
    </Card>
    {error ? <Status message={error} error /> : null}
    <Action label="Sign out" secondary onPress={() => { void signOut(); }} />
  </Page>;
}

const styles = StyleSheet.create({
  title: { color: palette.heading, fontSize: 28, fontWeight: '800', fontFamily: 'Plus Jakarta Sans' },
  help: { color: palette.muted, fontSize: 14 },
  role: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  roleText: { color: palette.heading, fontSize: 16 },
});
