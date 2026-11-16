/**
 * LinkWorks Client My Jobs Management Screen
 * 
 * Owner: Thimanya (Nearby job feed, job posting, applications, quotes, assignment, job lifecycle)
 * 
 * This screen displays all job postings created by the authenticated client:
 * 1. Queries Cloud Firestore `jobs` where `clientId == user.uid`.
 * 2. Lists all active and historical posted jobs with current quotes received.
 * 3. Provides quick navigation to job details or new job creation sheet.
 */

import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { JobCard } from '../../Bhashitha/Design/JobCard';
import type { Job } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';

// Client screen displaying all jobs created by the current account.
export default function MyJobsScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Array<Job & { id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load client's posted jobs directly from Cloud Firestore.
  const loadJobs = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const db = getSafeFirestore();
      const snapshot = await getDocs(
        query(collection(db, 'jobs'), where('clientId', '==', user.uid))
      );
      // Hydrate each posted job with its actual real-time quotes count from the applications subcollection
      const list: Array<Job & { id: string }> = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data() as Job;
          let realCount = data.applicationCount ?? 0;
          try {
            const appsSnap = await getDocs(collection(db, 'jobs', docSnap.id, 'applications'));
            realCount = appsSnap.docs.length;
          } catch {
            // Fallback to job document counter if subcollection fetch is blocked
          }
          return {
            ...data,
            id: docSnap.id,
            applicationCount: realCount,
          };
        })
      );
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
        {/* Screen Header with Title and Create Action */}
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
    paddingBottom: 140,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    color: palette.brand,
    letterSpacing: 0.8,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: palette.heading,
    fontFamily: 'Plus Jakarta Sans',
  },
  newButton: {
    backgroundColor: palette.brand,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 8,
  },
  newButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  stateBox: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
  },
  emptyTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '700',
    color: palette.heading,
  },
  stateText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    color: palette.danger,
    textAlign: 'center',
  },
});
