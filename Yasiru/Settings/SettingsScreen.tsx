/**
 * LinkWorks User Account & Settings Screen
 * 
 * Owner: Yasiru (Phone authentication, onboarding, account and worker setup, role context, settings)
 * 
 * This screen manages account preferences, role toggles, and worker configurations:
 * 1. Displays verified identity (name, verified mobile phone, hub city, avatar).
 * 2. Provides active mode switcher allowing dual-role members to seamlessly toggle between
 *    Client mode (job posting and worker discovery) and Worker mode (viewing open bids and quotes).
 * 3. Shows worker profile settings when in worker mode (day rates, skills, service radius).
 * 4. Provides legal disclosures, terms of service link, and a safe confirmation-prompted sign-out action.
 */

import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import { Action, Card, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { useAuth } from '../Auth/AuthContext';

// Comprehensive Settings Screen managing account details, worker services, role toggles, and legal disclosures.
export default function SettingsScreen() {
  const { user, profile, workerReady, selectRole, signOut } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

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
              <Text style={styles.phoneText}>{profile?.phone || user?.phoneNumber || '+94 77 123 4567'}</Text>
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

      {/* Worker Services Card: Shown exclusively when in Worker Mode */}
      {profile?.activeRole === 'worker' ? (
        <Card title="Worker Services &amp; Profile">
          <Text style={styles.workerServicesSubtitle}>
            Update your public trades, specialty skills, daily rates, and service coverage radius:
          </Text>
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
          <Text style={styles.infoValue}>v1.0.0</Text>
        </View>
        <Text style={styles.policySnippet}>
          Direct tradesperson marketplace built for Sri Lanka. All phone contacts remain masked until job assignment.
        </Text>
      </Card>

      {successMsg ? <Status message={successMsg} /> : null}
      {error ? <Status message={error} error /> : null}

      {/* Sign Out CTA */}
      <Action label="Sign Out" secondary onPress={handleSignOut} />
    </Page>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.heading,
    marginBottom: spacing.md,
    fontFamily: 'Plus Jakarta Sans',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: spacing.md,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: palette.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Plus Jakarta Sans',
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  displayName: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.heading,
    fontFamily: 'Plus Jakarta Sans',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  phoneText: {
    fontSize: 13,
    color: palette.muted,
    fontFamily: 'Plus Jakarta Sans',
  },
  verifiedBadge: {
    backgroundColor: '#e6f7f2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  verifiedBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.primary,
    fontFamily: 'Plus Jakarta Sans',
  },
  cityText: {
    fontSize: 13,
    color: palette.heading,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  modeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e8edf0',
    marginVertical: 12,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.heading,
    fontFamily: 'Plus Jakarta Sans',
  },
  modePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
  },
  clientPill: {
    backgroundColor: '#eef4ff',
  },
  workerPill: {
    backgroundColor: '#ecfdf5',
  },
  modePillText: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    color: palette.heading,
  },
  workerServicesSubtitle: {
    fontSize: 13,
    color: palette.muted,
    lineHeight: 19,
    marginBottom: 12,
    fontFamily: 'Plus Jakarta Sans',
  },
  appInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f3f5',
    marginTop: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: palette.muted,
    fontFamily: 'Plus Jakarta Sans',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.heading,
    fontFamily: 'Plus Jakarta Sans',
  },
  policySnippet: {
    fontSize: 12,
    color: palette.muted,
    lineHeight: 17,
    marginTop: 8,
    fontFamily: 'Plus Jakarta Sans',
  },
});
