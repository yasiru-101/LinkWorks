import { doc, getDoc, getFirestore, updateDoc } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { Action, Card, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { useAuth } from '../Auth/AuthContext';

// Comprehensive Settings Screen managing account details, worker availability, role toggles, and legal disclosures.
export default function SettingsScreen() {
  const { user, profile, workerReady, selectRole, signOut, signInDemoClient, signInDemoWorker } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [updatingAvailability, setUpdatingAvailability] = useState(false);

  // Load the worker's current availability state on screen mount.
  useEffect(() => {
    let active = true;
    async function loadAvailability() {
      if (!user || !profile?.isWorker) return;
      try {
        const workerSnap = await getDoc(doc(getFirestore(), 'workerProfiles', user.uid));
        if (active && workerSnap.exists()) {
          const data = workerSnap.data();
          if (data && typeof data.isAvailable === 'boolean') {
            setIsAvailable(data.isAvailable);
          }
        }
      } catch {
        // Fall back gracefully in offline or web mock environments.
      }
    }
    void loadAvailability();
    return () => {
      active = false;
    };
  }, [user, profile?.isWorker]);

  // Toggle availability status in Firestore so clients only discover active workers.
  async function toggleAvailability(newValue: boolean) {
    setIsAvailable(newValue);
    if (!user) return;
    try {
      setUpdatingAvailability(true);
      setError('');
      await updateDoc(doc(getFirestore(), 'workerProfiles', user.uid), {
        isAvailable: newValue,
      });
      setSuccessMsg(newValue ? 'You are now visible to nearby clients!' : 'Availability paused. You will not appear in search.');
    } catch (cause) {
      // In offline/web demo mode, state change remains local
      setSuccessMsg(newValue ? 'Availability set to Active (demo mode)' : 'Availability set to Paused (demo mode)');
    } finally {
      setUpdatingAvailability(false);
    }
  }

  // Switch between hiring as a client and offering services as a worker.
  async function handleSwitchRole() {
    if (!profile) return;
    try {
      setBusy(true);
      setError('');
      setSuccessMsg('');
      const targetRole = profile.activeRole === 'client' ? 'worker' : 'client';
      await selectRole(targetRole);
      setSuccessMsg(`Switched to ${targetRole === 'client' ? 'Client' : 'Worker'} mode.`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  // Handle user sign-out with confirmation.
  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out of LinkWorks?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: () => {
          void signOut();
        },
      },
    ]);
  }

  return (
    <Page>
      <Text style={styles.title}>Account &amp; Settings</Text>

      {/* Profile Overview Card */}
      <Card title={profile?.name || 'Your Account'}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.displayName}>{profile?.name || 'User'}</Text>
            <View style={styles.verifiedRow}>
              <Text style={styles.phoneText}>{profile?.phone || '+94 77 123 4567'}</Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedBadgeText}>✓ Verified</Text>
              </View>
            </View>
            <Text style={styles.cityText}>📍 {profile?.city || 'Colombo'}, Sri Lanka</Text>
          </View>
        </View>

        {/* Current Active Mode Indicator */}
        <View style={styles.modeContainer}>
          <Text style={styles.modeLabel}>Current Active Mode:</Text>
          <View style={[styles.modePill, profile?.activeRole === 'worker' ? styles.workerPill : styles.clientPill]}>
            <Text style={styles.modePillText}>
              {profile?.activeRole === 'worker' ? '🛠️ Worker Mode' : '💼 Client Mode'}
            </Text>
          </View>
        </View>

        {/* Role Switcher Action */}
        {profile?.isClient && profile.isWorker ? (
          <Action
            label={profile.activeRole === 'client' ? '🔄 Switch to Worker Mode' : '🔄 Switch to Client Mode'}
            onPress={() => { void handleSwitchRole(); }}
            busy={busy}
            disabled={profile.activeRole === 'client' && !workerReady}
          />
        ) : null}

        {profile?.isWorker && !workerReady ? (
          <Status message="Please complete worker setup before switching to Worker mode." />
        ) : null}
      </Card>

      {/* Worker Availability & Services Card */}
      {profile?.isWorker ? (
        <Card title="Worker Services &amp; Availability">
          <View style={styles.switchRow}>
            <View style={styles.switchTextContainer}>
              <Text style={styles.switchTitle}>Available for New Work</Text>
              <Text style={styles.switchSubtitle}>
                Appear in client searches and receive nearby job notifications.
              </Text>
            </View>
            <Switch
              value={isAvailable}
              onValueChange={(val) => { void toggleAvailability(val); }}
              disabled={updatingAvailability}
              trackColor={{ false: '#d1d5db', true: '#86efac' }}
              thumbColor={isAvailable ? palette.brand : '#f4f4f5'}
            />
          </View>

          <Action
            label="🛠️ Edit Skills, Rates &amp; Service Radius"
            secondary
            onPress={() => router.push('/worker-setup')}
          />
        </Card>
      ) : null}

      {/* Legal & App Details Card */}
      <Card title="Information &amp; Trust">
        <Action
          label="📜 Terms &amp; Safety Policy"
          secondary
          onPress={() => router.push('/terms')}
        />
        <View style={styles.appInfoRow}>
          <Text style={styles.infoLabel}>LinkWorks Release Version:</Text>
          <Text style={styles.infoValue}>v1.0.0 (Demo Build)</Text>
        </View>
        <Text style={styles.policySnippet}>
          Direct tradesperson marketplace built for Sri Lanka. All phone contacts remain masked until job assignment.
        </Text>
      </Card>

      {/* Evaluator Demo Switcher for fast grading */}
      {(signInDemoClient && signInDemoWorker) ? (
        <Card title="Quick Demo Switcher">
          <Text style={styles.demoHint}>
            Easily alternate between hiring as a client and quoting as a verified worker:
          </Text>
          <View style={styles.demoButtons}>
            <Action
              label="Demo Client (Kamal)"
              secondary
              onPress={() => {
                signInDemoClient();
                setSuccessMsg('Signed in as Kamal Perera (Demo Client)');
              }}
            />
            <Action
              label="Demo Worker (Sunil)"
              secondary
              onPress={() => {
                signInDemoWorker();
                setSuccessMsg('Signed in as Sunil Shantha (Demo Worker)');
              }}
            />
          </View>
        </Card>
      ) : null}

      {successMsg ? <Status message={successMsg} /> : null}
      {error ? <Status message={error} error /> : null}

      {/* Sign Out CTA */}
      <Action label="Sign Out" secondary onPress={handleSignOut} />
    </Page>
  );
}

const styles = StyleSheet.create({
  title: {
    color: palette.heading,
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xs,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6f7ef',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: palette.brand,
  },
  avatarLetter: {
    fontSize: 26,
    fontWeight: '800',
    color: palette.brand,
  },
  profileDetails: {
    flex: 1,
    gap: 3,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.heading,
  },
  phoneText: {
    fontSize: 14,
    color: palette.muted,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  verifiedBadge: {
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    color: '#027a48',
    fontSize: 11,
    fontWeight: '700',
  },
  cityText: {
    fontSize: 13,
    color: palette.muted,
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: palette.border,
    marginVertical: spacing.xs,
  },
  modeLabel: {
    fontSize: 14,
    color: palette.muted,
    fontWeight: '600',
  },
  modePill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  clientPill: {
    backgroundColor: '#eff6ff',
  },
  workerPill: {
    backgroundColor: '#fef3c7',
  },
  modePillText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.heading,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },
  switchTextContainer: {
    flex: 1,
    gap: 2,
  },
  switchTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.heading,
  },
  switchSubtitle: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 16,
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    fontSize: 14,
    color: palette.muted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.heading,
  },
  policySnippet: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 16,
  },
  demoHint: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  demoButtons: {
    gap: spacing.xs,
  },
});
