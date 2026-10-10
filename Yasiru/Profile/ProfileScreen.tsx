import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Action, Card, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette } from '../../Bhashitha/Design/theme';
import { useAuth } from '../Auth/AuthContext';

// Show the private account and let a two-role user switch between client and worker tabs.
export default function ProfileScreen() {
  const { profile, workerReady, selectRole, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Save a role change before the navigation shell displays the other destinations.
  async function switchRole() {
    if (!profile) return;
    try {
      setBusy(true);
      setError('');
      await selectRole(profile.activeRole === 'client' ? 'worker' : 'client');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  return <Page>
    <Text style={styles.title}>Profile</Text>
    <Card title={profile?.name ?? 'Your account'}>
      <Text style={styles.line}>City: {profile?.city}</Text>
      <Text style={styles.line}>Role: {profile?.activeRole === 'worker' ? 'Worker' : 'Client'}</Text>
      <Text style={styles.line}>Phone: {profile?.phone}</Text>
      {profile?.isClient && profile.isWorker ? <Action label={profile.activeRole === 'client' ? 'Switch to Worker' : 'Switch to Client'} onPress={() => { void switchRole(); }} busy={busy} disabled={!workerReady} /> : null}
      {profile?.isWorker && !workerReady ? <Status message="Finish worker setup before switching to Worker mode." /> : null}
    </Card>
    {error ? <Status message={error} error /> : null}
    <Action label="Sign out" secondary onPress={() => { void signOut(); }} />
  </Page>;
}

const styles = StyleSheet.create({
  title: { color: palette.heading, fontSize: 28, fontWeight: '800', fontFamily: 'Plus Jakarta Sans' },
  line: { color: palette.muted, fontSize: 15 },
});
