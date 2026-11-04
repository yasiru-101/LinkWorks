import { doc, getDocFromServer, getFirestore } from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, Card } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { SEED_WORKERS } from '../../Bhashitha/Seed/seed-data';
import type { WorkerProfile } from '../../mobile/src/types/domain';

// Detailed public worker profile screen with stats, bio, skills, and quote request CTA.
export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch the worker's public document or find from seed workers.
  useEffect(() => {
    async function fetchWorker() {
      if (!id) return;
      try {
        setLoading(true);
        setError('');
        try {
          const snapshot = await getDocFromServer(doc(getFirestore(), 'workerProfiles', id));
          if (snapshot.exists()) {
            setWorker(snapshot.data() as WorkerProfile);
            return;
          }
        } catch {
          // Fall back to seed workers in demo/preview.
        }

        const fallback = SEED_WORKERS.find((w) => w.userId === id);
        if (fallback) {
          setWorker(fallback);
        } else {
          setError('Worker profile not found.');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading worker.');
      } finally {
        setLoading(false);
      }
    }
    void fetchWorker();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Loading profile…</Text>
      </SafeAreaView>
    );
  }

  if (error || !worker) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Worker not found'}</Text>
        <Action label="Go Back" secondary onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const primarySkill = worker.skills[0] ?? 'Plumbing';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Navigation Bar */}
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.screenTitle}>Worker Profile</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* Profile Header Card */}
        <Card>
          <View style={styles.avatarRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{worker.displayName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.titleArea}>
              <Text style={styles.name}>{worker.displayName}</Text>
              <Text style={styles.verifiedBadge}>✓ Verified Tradesperson</Text>
              <Text style={styles.cityText}>📍 {worker.city} • {worker.serviceRadiusKm} km coverage</Text>
            </View>
          </View>

          {/* Quick Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {worker.ratingCount > 0 ? worker.ratingAvg.toFixed(1) : '—'} ★
              </Text>
              <Text style={styles.metricLabel}>{worker.ratingCount} reviews</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{worker.jobsCompleted}</Text>
              <Text style={styles.metricLabel}>Completed</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>{worker.experienceYears} yrs</Text>
              <Text style={styles.metricLabel}>Experience</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricValue}>
                {worker.dayRateLkr ? `Rs. ${worker.dayRateLkr.toLocaleString()}` : 'Negotiable'}
              </Text>
              <Text style={styles.metricLabel}>Daily Rate</Text>
            </View>
          </View>
        </Card>

        {/* Skills Section */}
        <Card title="Skills & Specialties">
          <View style={styles.skillsWrap}>
            {worker.skills.map((skill) => (
              <View key={skill} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </Card>

        {/* Bio / About Section */}
        <Card title="About the Tradesperson">
          <Text style={styles.bioText}>{worker.bio}</Text>
        </Card>

        {/* Privacy Notice Banner */}
        <View style={styles.privacyBanner}>
          <Text style={styles.privacyIcon}>🔒</Text>
          <Text style={styles.privacyText}>
            Phone number and direct chat are unlocked once this worker is assigned to a job.
          </Text>
        </View>

        {/* Primary CTA */}
        <Action
          label={`Request Quote from ${worker.displayName}`}
          onPress={() =>
            router.push({
              pathname: '/post-job',
              params: {
                prefillCategory: primarySkill,
                workerName: worker.displayName,
              },
            })
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: palette.background,
  },
  loadingText: {
    color: palette.muted,
    fontSize: 15,
  },
  errorText: {
    color: palette.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  container: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  screenTitle: {
    color: palette.heading,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6f1ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: palette.primary,
    fontSize: 26,
    fontWeight: '800',
  },
  titleArea: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: palette.heading,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  verifiedBadge: {
    color: '#027a48',
    fontSize: 12,
    fontWeight: '700',
  },
  cityText: {
    color: palette.muted,
    fontSize: 13,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    marginTop: spacing.xs,
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    color: palette.heading,
    fontSize: 15,
    fontWeight: '800',
  },
  metricLabel: {
    color: palette.muted,
    fontSize: 11,
    marginTop: 2,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  skillChip: {
    backgroundColor: palette.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: palette.border,
  },
  skillText: {
    color: palette.heading,
    fontSize: 13,
    fontWeight: '600',
  },
  bioText: {
    color: '#344454',
    fontSize: 14,
    lineHeight: 22,
  },
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#e6f1ec',
    borderRadius: 12,
    padding: spacing.md,
  },
  privacyIcon: {
    fontSize: 18,
  },
  privacyText: {
    flex: 1,
    color: '#17644b',
    fontSize: 13,
    lineHeight: 18,
  },
});
