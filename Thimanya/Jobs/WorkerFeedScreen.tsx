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

const RADIUS_OPTIONS = [5, 10, 15, 25, 50];

// Main Worker Feed screen showing nearby open jobs matching the worker's trade skills.
export default function WorkerFeedScreen() {
  const { user } = useAuth();
  const {
    city,
    lat,
    lng,
    radiusKm,
    isGpsActive,
    isLocating,
    isOutOfCoverage,
    requestDeviceLocation,
    setCity,
    setRadiusKm,
  } = useSearchCenter();

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
      const workerSkills = workerProfile?.skills ?? ['Plumbing'];
      const effectiveRadius = Math.min(radiusKm, workerProfile?.serviceRadiusKm ?? 50);

      const matched = list
        .filter((job) => {
          // 1. Skill match: job's category must be among the worker's registered skills
          const skillMatch = workerSkills.some(
            (skill) => skill.toLowerCase() === job.categoryId.toLowerCase()
          );
          if (!skillMatch) return false;

          // 2. Distance match: job must be within search/service radius
          const jobCoords = job.geo ?? { lat: 6.9271, lng: 79.8612 };
          const dist = distanceKm(centerCoords, jobCoords);
          return dist <= effectiveRadius;
        })
        .map((job) => {
          const jobCoords = job.geo ?? { lat: 6.9271, lng: 79.8612 };
          return {
            ...job,
            distanceKm: distanceKm(centerCoords, jobCoords),
          };
        })
        .sort((a, b) => a.distanceKm - b.distanceKm);

      setJobs(matched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load matching jobs.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lat, lng, radiusKm, workerProfile]);

  useEffect(() => {
    void loadWorkerProfile();
  }, [loadWorkerProfile]);

  useEffect(() => {
    if (workerProfile) {
      void loadMatchingJobs();
    }
  }, [workerProfile, loadMatchingJobs]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (isGpsActive) {
      await requestDeviceLocation(true);
    }
    await Promise.all([loadWorkerProfile(), loadMatchingJobs()]);
    setRefreshing(false);
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Top Header Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>AVAILABLE WORK</Text>
            <Text style={styles.heading}>Nearby Jobs</Text>
          </View>

          {/* Current City / GPS Pill */}
          <Pressable
            accessibilityRole="button"
            onPress={() => setCityModalVisible(true)}
            style={[styles.cityPill, isGpsActive && styles.cityPillGps]}
          >
            <View style={[styles.statusDot, isGpsActive ? styles.dotGps : styles.dotManual]} />
            <Text style={styles.cityText}>
              {isLocating ? 'Locating…' : isGpsActive ? `GPS: ${city}` : city}
            </Text>
          </Pressable>
        </View>

        {/* Out of Coverage Warning */}
        {isOutOfCoverage ? (
          <View style={styles.coverageNoticeCard}>
            <Text style={styles.coverageNoticeTitle}>🚧 We're not in your area yet!</Text>
            <Text style={styles.coverageNoticeBody}>
              LinkWorks has not launched job matching in your current GPS area yet. Please select one of our supported cities to see available work.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCityModalVisible(true)}
              style={styles.coverageNoticeButton}
            >
              <Text style={styles.coverageNoticeButtonText}>📍 Select a Supported City</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Worker Trade & Skills Banner */}
        <View style={styles.skillsBanner}>
          <Text style={styles.skillsBannerTitle}>
            Showing jobs for: {workerProfile?.skills.join(', ') || 'Your Trade'}
          </Text>
          <Text style={styles.skillsBannerSubtitle}>
            Within {radiusKm} km • Quoted in integer LKR
          </Text>
        </View>

        {/* Radius Filter Chips */}
        <View style={styles.radiusRow}>
          <Text style={styles.radiusLabel}>Radius:</Text>
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

        {/* Results Count & Location Subtitle */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            Open Jobs ({jobs.length})
          </Text>
          <Text style={styles.resultsLocation}>
            {isGpsActive ? `Near your GPS location (${city})` : `within ${radiusKm} km of ${city}`}
          </Text>
        </View>

        {/* List of Jobs or States */}
        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.stateText}>Finding jobs matching your trade…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={() => void loadMatchingJobs()} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : jobs.length === 0 ? (
          <View style={styles.stateContainer}>
            <Text style={styles.emptyTitle}>No matching jobs nearby</Text>
            <Text style={styles.stateText}>
              There are currently no open {workerProfile?.skills.join('/')} jobs within {radiusKm} km of {city}.
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

      {/* City Switcher Modal with GPS option */}
      <CitySelectorModal
        visible={cityModalVisible}
        currentCity={city}
        onSelectCity={(newCity: SupportedCity) => setCity(newCity)}
        onUseGps={async () => {
          await requestDeviceLocation(true);
        }}
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
    gap: 6,
    backgroundColor: palette.surface,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cityPillGps: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGps: {
    backgroundColor: '#059669',
  },
  dotManual: {
    backgroundColor: '#9ca3af',
  },
  cityText: {
    color: palette.heading,
    fontSize: 13,
    fontWeight: '700',
  },
  coverageNoticeCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 14,
    padding: spacing.md,
    gap: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  coverageNoticeTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#92400e',
  },
  coverageNoticeBody: {
    fontSize: 13,
    color: '#78350f',
    lineHeight: 18,
  },
  coverageNoticeButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#d97706',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    marginTop: 4,
  },
  coverageNoticeButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  skillsBanner: {
    backgroundColor: '#e6f7ef',
    borderRadius: 14,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#b2e8d0',
  },
  skillsBannerTitle: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '700',
  },
  skillsBannerSubtitle: {
    color: palette.muted,
    fontSize: 12,
    marginTop: 2,
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
  stateContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: palette.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    marginVertical: spacing.md,
  },
  stateText: {
    color: palette.muted,
    fontSize: 14,
    textAlign: 'center',
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
