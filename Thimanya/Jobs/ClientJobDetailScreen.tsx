import { doc, getDocFromServer, getFirestore, serverTimestamp, updateDoc } from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, Card } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { SEED_JOBS } from '../../Bhashitha/Seed/seed-data';
import type { Job } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { canTransitionJob } from '../JobContracts/validation';

// Screen displaying full client job details, quotes overview, and cancellation.
export default function ClientJobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const [job, setJob] = useState<(Job & { id: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Fetch job details from Firestore or fallback.
  const fetchJob = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      try {
        const snapshot = await getDocFromServer(doc(getFirestore(), 'jobs', id));
        if (snapshot.exists()) {
          setJob({ ...(snapshot.data() as Job), id: snapshot.id });
          return;
        }
      } catch {
        // Fall back to seed job in demo/preview.
      }

      const fallback = SEED_JOBS.find((j) => j.id === id);
      if (fallback) {
        setJob(fallback);
      } else {
        setError('Job not found.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading job.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchJob();
  }, [fetchJob]);

  // Cancel an open job using the permitted lifecycle transition.
  async function cancelJob() {
    if (!job || !user) return;
    if (!canTransitionJob(job.status, 'cancelled', 'client')) {
      setError('Only open jobs can be cancelled.');
      return;
    }

    try {
      setBusy(true);
      setError('');
      try {
        await updateDoc(doc(getFirestore(), 'jobs', job.id), {
          status: 'cancelled',
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Update local state in preview mode.
      }
      setJob((prev) => (prev ? { ...prev, status: 'cancelled' } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not cancel job.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Loading job details…</Text>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Job not found'}</Text>
        <Action label="Go Back" secondary onPress={() => router.back()} />
      </SafeAreaView>
    );
  }

  const budgetText =
    job.budgetMinLkr && job.budgetMaxLkr
      ? `Rs. ${job.budgetMinLkr.toLocaleString()} – ${job.budgetMaxLkr.toLocaleString()}`
      : job.budgetMaxLkr
      ? `Up to Rs. ${job.budgetMaxLkr.toLocaleString()}`
      : 'Negotiable';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Top Navigation */}
        <View style={styles.topBar}>
          <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
          <Text style={styles.screenTitle}>Job Details</Text>
          <View style={{ width: 48 }} />
        </View>

        {/* Primary Job Info Card */}
        <Card>
          <View style={styles.categoryRow}>
            <Text style={styles.categoryBadge}>{job.categoryId.toUpperCase()}</Text>
            <View style={[styles.statusBadge, job.status === 'open' ? styles.statusOpen : styles.statusOther]}>
              <Text style={styles.statusText}>{job.status.toUpperCase()}</Text>
            </View>
          </View>

          <Text style={styles.jobTitle}>{job.title}</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Budget:</Text>
            <Text style={styles.budgetValue}>{budgetText}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{job.addressText}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Timeline:</Text>
            <Text style={styles.infoValue}>{job.preferredDate ?? 'Flexible'}</Text>
          </View>
        </Card>

        {/* Detailed Description */}
        <Card title="Description">
          <Text style={styles.descriptionText}>{job.description}</Text>
        </Card>

        {/* Quotes & Applications Section */}
        <Card title={`Quotes (${job.applicationCount})`}>
          {job.applicationCount === 0 ? (
            <Text style={styles.emptyQuotes}>
              No quotes submitted yet. Nearby {job.categoryId.toLowerCase()} workers in this area are being notified.
            </Text>
          ) : (
            <View style={styles.quotesBox}>
              <Text style={styles.quotesNotice}>
                {job.applicationCount} worker quote{job.applicationCount > 1 ? 's' : ''} received. Side-by-side quote comparison and one-worker assignment unlocks in Phase 3.
              </Text>
            </View>
          )}
        </Card>

        {/* Cancellation Option */}
        {job.status === 'open' && (
          <Action
            label="Cancel This Job"
            secondary
            busy={busy}
            onPress={() => {
              void cancelJob();
            }}
          />
        )}
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
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryBadge: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOpen: {
    backgroundColor: '#e6f7ef',
  },
  statusOther: {
    backgroundColor: '#f2f4f7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
  },
  jobTitle: {
    color: palette.heading,
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    lineHeight: 28,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    color: palette.muted,
    fontSize: 14,
  },
  budgetValue: {
    color: palette.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  infoValue: {
    color: palette.heading,
    fontSize: 14,
    fontWeight: '600',
  },
  descriptionText: {
    color: '#344454',
    fontSize: 15,
    lineHeight: 22,
  },
  emptyQuotes: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  quotesBox: {
    backgroundColor: '#f0f9f6',
    borderRadius: 10,
    padding: spacing.md,
  },
  quotesNotice: {
    color: '#17644b',
    fontSize: 14,
    lineHeight: 20,
  },
});
