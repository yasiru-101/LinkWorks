import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { JobCard } from '../../Bhashitha/Design/JobCard';
import { SEED_JOBS } from '../../Bhashitha/Seed/seed-data';
import type { Job, JobStatus } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';

type StatusFilter = 'all' | JobStatus;

const FILTER_TABS: Array<{ id: StatusFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'open', label: 'Open' },
  { id: 'assigned', label: 'Assigned' },
  { id: 'in_progress', label: 'In Progress' },
  { id: 'completed', label: 'Completed' },
];

// Client screen displaying all jobs created by the current account with status filters.
export default function MyJobsScreen() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Array<Job & { id: string }>>([]);
  const [activeFilter, setActiveFilter] = useState<StatusFilter>('all');
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

  // Filter jobs based on selected lifecycle status tab.
  const filteredJobs = useMemo(() => {
    if (activeFilter === 'all') return jobs;
    return jobs.filter((job) => job.status === activeFilter);
  }, [jobs, activeFilter]);

  // Compute count per tab for badges.
  const counts = useMemo(() => {
    const map: Record<StatusFilter, number> = {
      all: jobs.length,
      open: 0,
      assigned: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };
    for (const job of jobs) {
      if (map[job.status] !== undefined) {
        map[job.status] += 1;
      }
    }
    return map;
  }, [jobs]);

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

        {/* Status Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {FILTER_TABS.map((tab) => {
            const isSelected = activeFilter === tab.id;
            const count = counts[tab.id];
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveFilter(tab.id)}
                style={[styles.tabChip, isSelected && styles.tabChipSelected]}
              >
                <Text style={[styles.tabLabel, isSelected && styles.tabLabelSelected]}>
                  {tab.label}
                </Text>
                {count > 0 ? (
                  <View style={[styles.countBadge, isSelected && styles.countBadgeSelected]}>
                    <Text style={[styles.countText, isSelected && styles.countTextSelected]}>
                      {count}
                    </Text>
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </ScrollView>

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
        ) : filteredJobs.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.emptyTitle}>
              {activeFilter === 'all' ? 'No Jobs Posted Yet' : `No ${activeFilter.replace('_', ' ')} Jobs`}
            </Text>
            <Text style={styles.stateText}>
              {activeFilter === 'all'
                ? 'Post a skilled trade job to receive competitive quotes from nearby carpenters, plumbers, electricians, and more.'
                : `You currently have no jobs marked as ${activeFilter.replace('_', ' ')}.`}
            </Text>
            {activeFilter !== 'all' ? (
              <Action label="Show All Jobs" secondary onPress={() => setActiveFilter('all')} />
            ) : (
              <Action label="Post Your First Job" onPress={() => router.push('/post-job')} />
            )}
          </View>
        ) : (
          filteredJobs.map((job) => (
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eyebrow: {
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
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  tabsContainer: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: 2,
  },
  tabChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f4f4f5',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  tabChipSelected: {
    backgroundColor: palette.brand,
    borderColor: palette.brand,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.muted,
  },
  tabLabelSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: '#e4e4e7',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },
  countBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  countText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.muted,
  },
  countTextSelected: {
    color: '#ffffff',
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
    fontSize: 18,
    fontWeight: '700',
    color: palette.heading,
  },
  stateText: {
    fontSize: 14,
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: palette.danger,
    textAlign: 'center',
  },
});
