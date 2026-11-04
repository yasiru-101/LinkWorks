import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { JobCard } from '../../Bhashitha/Design/JobCard';
import { SEED_JOBS } from '../../Bhashitha/Seed/seed-data';
import type { Job } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';

// Client screen displaying all jobs created by the current account.
export default function MyJobsScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Array<Job & { id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load client's posted jobs from Firestore.
  const loadJobs = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      let list: Array<Job & { id: string }> = [];

      try {
        const snapshot = await getDocs(
          query(collection(getFirestore(), 'jobs'), where('clientId', '==', user.uid))
        );
        if (!snapshot.empty) {
          list = snapshot.docs.map((docSnap) => ({
            ...(docSnap.data() as Job),
            id: docSnap.id,
          }));
        }
      } catch {
        // Fall back to seed jobs associated with demo client in development.
        list = SEED_JOBS.filter((j) => j.clientId === 'client-demo-1');
      }

      setJobs(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load your jobs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    void loadJobs();
  }, [loadJobs]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadJobs();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>MY WORK REQUESTS</Text>
            <Text style={styles.heading}>My Posted Jobs</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/post-job')}
            style={styles.newButton}
          >
            <Text style={styles.newButtonText}>+ New Job</Text>
          </Pressable>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.stateText}>Loading your jobs…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Action label="Retry" secondary onPress={loadJobs} />
          </View>
        ) : jobs.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.emptyTitle}>No Jobs Posted Yet</Text>
            <Text style={styles.stateText}>
              Post a skilled trade job to receive competitive quotes from nearby carpenters, plumbers, electricians, and more.
            </Text>
            <Action label="Post Your First Job" onPress={() => router.push('/post-job')} />
          </View>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
            />
          ))
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
  container: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  eyebrow: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  heading: {
    color: palette.heading,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  newButton: {
    backgroundColor: palette.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  newButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  stateBox: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
    marginVertical: spacing.md,
  },
  stateText: {
    color: palette.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyTitle: {
    color: palette.heading,
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    textAlign: 'center',
  },
});
