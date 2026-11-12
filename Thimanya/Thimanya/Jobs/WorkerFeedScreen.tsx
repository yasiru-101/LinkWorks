import { collection, doc, getDocFromServer, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CitySelectorModal } from '../../Bhashitha/Design/CitySelectorModal';
import { JobCard } from '../../Bhashitha/Design/JobCard';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { SEED_JOBS, SEED_WORKERS } from '../../Bhashitha/Seed/seed-data';
import type { Job, WorkerProfile } from '../../mobile/src/types/domain';
import { distanceKm, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { useSearchCenter } from '../../Pasindu/Discovery/search-center';
import { useAuth } from '../../Yasiru/Auth/AuthContext';

const RADIUS_OPTIONS = [10, 15, 25, 50];

// Main Worker Feed screen showing nearby open jobs matching the worker's trade skills.
export default function WorkerFeedScreen() {
  const { user } = useAuth();
  const { city, lat, lng, radiusKm, setCity, setRadiusKm } = useSearchCenter();

  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null);
  const [jobs, setJobs] = useState<Array<Job & { id: string; distanceKm: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  // Load worker's skills and service radius from profile.
  const loadWorkerProfile = useCallback(async () => {
    if (!user) return;
    try {
      const snap = await getDocFromServer(doc(getFirestore(), 'workerProfiles', user.uid));
      if (snap.exists()) {
        setWorkerProfile(snap.data() as WorkerProfile);
        return;
      }
    } catch {
      // In web/preview, match with first seed worker
    }
    const defaultProfile = SEED_WORKERS[0];
    setWorkerProfile(defaultProfile);
  }, [user]);

  // Load open jobs and filter by worker skills and geographic radius.
  const loadMatchingJobs = useCallback(async () => {
    try {
      setError(null);
      let list: Array<Job & { id: string }> = [];

      try {
        const snapshot = await getDocs(
          query(collection(getFirestore(), 'jobs'), where('status', '==', 'open'))
        );
        if (!snapshot.empty) {
          list = snapshot.docs.map((docSnap) => ({
            ...(docSnap.data() as Job),
            id: docSnap.id,
          }));
        }
      } catch {
        // Fall back to seed open jobs in demo/preview.
        list = SEED_JOBS.filter((j) => j.status === 'open');
      }

      if (list.length === 0) {
        list = SEED_JOBS.filter((j) => j.status === 'open');
      }

      const centerCoords = { lat, lng };
      const workerSkills = workerProfile?.skills.map((s) => s.toLowerCase()) ?? [];

      // Filter by skill match and distance.
      const matched = list
        .filter((job) => {
          if (!workerSkills.length) return true;
          return workerSkills.includes(job.categoryId.toLowerCase());
        })
        .map((job) => {
          const distance = distanceKm(centerCoords, job.geo);
          return { ...job, distanceKm: distance };
        })
        .filter((job) => job.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      setJobs(matched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load job feed.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lat, lng, radiusKm, workerProfile]);

  useEffect(() => {
    void loadWorkerProfile();
  }, [loadWorkerProfile]);

  useEffect(() => {
    void loadMatchingJobs();
  }, [loadMatchingJobs]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadMatchingJobs();
  };

  const skillsLabel = workerProfile?.skills?.join(', ') || 'All Trades';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>WORKER DISCOVERY</Text>
            <Text style={styles.heading}>Job Feed</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Active city ${city}. Tap to change.`}
            onPress={() => setCityModalVisible(true)}
            style={styles.cityPill}
          >
            <Text style={styles.cityIcon}>📍</Text>
            <Text style={styles.cityText}>{city}</Text>
          </Pressable>
        </View>

        {/* Worker Trade Filter Banner */}
        <View style={styles.skillsBanner}>
          <Text style={styles.skillsBannerTitle}>Matching your trades:</Text>
          <Text style={styles.skillsBannerSubtitle}>{skillsLabel}</Text>
        </View>

        {/* Radius Filter */}
        <View style={styles.radiusRow}>
          <Text style={styles.radiusLabel}>Search Radius:</Text>
          {RADIUS_OPTIONS.map((r) => {
            const isSelected = radiusKm === r;
            return (
              <Pressable
                key={r}
                accessibilityRole="button"
                onPress={() => setRadiusKm(r)}
                style={[styles.radiusChip, isSelected && styles.selectedRadius]}
              >
                <Text style={[styles.radiusText, isSelected && styles.selectedRadiusText]}>
                  {r} km
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>Open Jobs ({jobs.length})</Text>
          <Text style={styles.resultsLocation}>
            within {radiusKm} km of {city}
          </Text>
        </View>

        {/* Jobs List / State */}
        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.stateText}>Locating matching jobs nearby…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={loadMatchingJobs} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : jobs.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.emptyTitle}>No Matching Jobs Right Now</Text>
            <Text style={styles.stateText}>
              There are currently no open {skillsLabel} jobs within {radiusKm} km of {city}. Expand your search radius or check back soon!
            </Text>
            <Pressable onPress={() => setRadiusKm(50)} style={styles.expandButton}>
              <Text style={styles.expandText}>Expand search to 50 km</Text>
            </Pressable>
          </View>
        ) : (
          jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              distanceKm={job.distanceKm}
              onPress={() => router.push({ pathname: '/job/[id]', params: { id: job.id } })}
            />
          ))
        )}
      </ScrollView>

      <CitySelectorModal
        visible={cityModalVisible}
        currentCity={city}
        onSelectCity={(newCity: SupportedCity) => setCity(newCity)}
        onClose={() => setCityModalVisible(false)}
      />
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
    gap: spacing.sm,
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
  cityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cityIcon: {
    fontSize: 14,
  },
  cityText: {
    color: palette.heading,
    fontSize: 14,
    fontWeight: '700',
  },
  skillsBanner: {
    backgroundColor: '#e6f1ec',
    borderRadius: 12,
    padding: spacing.md,
    gap: 2,
  },
  skillsBannerTitle: {
    color: '#17644b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  skillsBannerSubtitle: {
    color: palette.heading,
    fontSize: 15,
    fontWeight: '800',
  },
  radiusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  radiusLabel: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  radiusChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  selectedRadius: {
    backgroundColor: palette.heading,
    borderColor: palette.heading,
  },
  radiusText: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  selectedRadiusText: {
    color: '#ffffff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: spacing.xs,
  },
  resultsTitle: {
    color: palette.heading,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  resultsLocation: {
    color: palette.muted,
    fontSize: 12,
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
    fontSize: 17,
    fontWeight: '700',
  },
  expandButton: {
    marginTop: spacing.xs,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: palette.primary,
    borderRadius: 20,
  },
  expandText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    textAlign: 'center',
  },
  retryButton: {
    marginTop: spacing.xs,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 20,
  },
  retryText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
