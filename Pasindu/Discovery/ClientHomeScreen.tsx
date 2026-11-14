import { collection, getDocs, getFirestore, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryChips, type TradeCategory } from '../../Bhashitha/Design/CategoryChips';
import { CitySelectorModal } from '../../Bhashitha/Design/CitySelectorModal';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { WorkerCard } from '../../Bhashitha/Design/WorkerCard';
import { SEED_WORKERS } from '../../Bhashitha/Seed/seed-data';
import type { WorkerProfile } from '../../mobile/src/types/domain';
import { distanceKm, type SupportedCity } from './geo';
import { useSearchCenter } from './search-center';
import WorkerMapView from './WorkerMapView';

const RADIUS_OPTIONS = [5, 10, 15, 25, 50];

// Main Client Home Screen providing automatic distance-sorted nearby worker discovery.
export default function ClientHomeScreen() {
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

  const [selectedCategory, setSelectedCategory] = useState<TradeCategory>('All');
  const [searchText, setSearchText] = useState('');
  const [workers, setWorkers] = useState<Array<WorkerProfile & { distanceKm: number }>>([]);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  // Load available workers from Firestore, or fall back to seed data if empty/offline.
  const loadWorkers = useCallback(async () => {
    try {
      setError(null);
      let list: WorkerProfile[] = [];
      try {
        const snapshot = await getDocs(
          query(collection(getFirestore(), 'workerProfiles'), where('isAvailable', '==', true))
        );
        if (!snapshot.empty) {
          list = snapshot.docs.map((doc) => doc.data() as WorkerProfile);
        }
      } catch {
        // Fall back gracefully to seed workers in development/preview environments.
        list = SEED_WORKERS;
      }

      if (list.length === 0) {
        list = SEED_WORKERS;
      }

      // Filter by category, text query, and calculate exact Haversine distance.
      const centerCoords = { lat, lng };
      const matched = list
        .filter((w) => w.isAvailable !== false)
        .filter((w) => {
          if (selectedCategory !== 'All' && !w.skills.some((s) => s.toLowerCase() === selectedCategory.toLowerCase())) {
            return false;
          }
          if (searchText.trim().length > 0) {
            const queryLower = searchText.toLowerCase();
            const nameMatch = w.displayName.toLowerCase().includes(queryLower);
            const skillMatch = w.skills.some((s) => s.toLowerCase().includes(queryLower));
            const bioMatch = w.bio.toLowerCase().includes(queryLower);
            return nameMatch || skillMatch || bioMatch;
          }
          return true;
        })
        .map((w) => {
          const distance = distanceKm(centerCoords, w.base);
          return { ...w, distanceKm: distance };
        })
        .filter((w) => w.distanceKm <= radiusKm)
        .sort((a, b) => a.distanceKm - b.distanceKm);

      setWorkers(matched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load workers.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [lat, lng, radiusKm, selectedCategory, searchText]);

  useEffect(() => {
    void loadWorkers();
  }, [loadWorkers]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (isGpsActive) {
      await requestDeviceLocation(true);
    }
    await loadWorkers();
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
            <Text style={styles.eyebrow}>SRI LANKA TRADES</Text>
            <Text style={styles.heading}>Find Workers</Text>
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

        {/* Out of Coverage Notice Banner */}
        {isOutOfCoverage ? (
          <View style={styles.coverageNoticeCard}>
            <Text style={styles.coverageNoticeTitle}>🚧 We're not in your area yet!</Text>
            <Text style={styles.coverageNoticeBody}>
              LinkWorks is actively expanding across Sri Lanka. We haven't launched services in your exact area yet, but you can choose a supported city below to explore available tradespeople.
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

        {/* Post a Job CTA Banner */}
        <View style={styles.postJobBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Need a custom quote?</Text>
            <Text style={styles.bannerSubtitle}>
              Post your job and verified workers will send you prices.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/post-job')}
            style={styles.bannerButton}
          >
            <Text style={styles.bannerButtonText}>+ Post Job</Text>
          </Pressable>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search by name, skill, or keyword…"
            placeholderTextColor="#7d9089"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
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

        {/* Category Horizontal Chips */}
        <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* View Switcher: List vs Map */}
        <View style={styles.viewModeToggle}>
          <Pressable
            onPress={() => setViewMode('list')}
            style={[styles.modeButton, viewMode === 'list' && styles.modeButtonActive]}
          >
            <Text style={[styles.modeButtonText, viewMode === 'list' && styles.modeButtonTextActive]}>
              📋 List View ({workers.length})
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setViewMode('map')}
            style={[styles.modeButton, viewMode === 'map' && styles.modeButtonActive]}
          >
            <Text style={[styles.modeButtonText, viewMode === 'map' && styles.modeButtonTextActive]}>
              🗺️ Map View
            </Text>
          </Pressable>
        </View>

        {/* Results Location Subtitle */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsLocation}>
            {isGpsActive ? `Showing workers near your GPS position (${city})` : `Showing workers within ${radiusKm} km of ${city}`}
          </Text>
        </View>

        {/* Content based on View Mode */}
        {loading ? (
          <View style={styles.stateContainer}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.stateText}>Locating nearby workers…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <Pressable onPress={loadWorkers} style={styles.retryButton}>
              <Text style={styles.retryText}>Retry</Text>
            </Pressable>
          </View>
        ) : workers.length === 0 ? (
          <View style={styles.stateContainer}>
            <Text style={styles.emptyTitle}>No workers found</Text>
            <Text style={styles.stateText}>
              There are no available {selectedCategory === 'All' ? '' : selectedCategory} workers within {radiusKm} km of {city}.
            </Text>
            <View style={styles.emptyActions}>
              <Pressable onPress={() => setRadiusKm(50)} style={styles.expandButton}>
                <Text style={styles.expandText}>Expand to 50 km</Text>
              </Pressable>
              <Pressable onPress={() => setCityModalVisible(true)} style={styles.switchCityButton}>
                <Text style={styles.switchCityText}>Change City</Text>
              </Pressable>
            </View>
          </View>
        ) : viewMode === 'map' ? (
          <WorkerMapView
            workers={workers}
            city={city}
            radiusKm={radiusKm}
            onSelectWorker={(w) =>
              router.push({ pathname: '/worker/[id]', params: { id: w.userId } })
            }
          />
        ) : (
          workers.map((worker) => (
            <WorkerCard
              key={worker.userId}
              worker={worker}
              distanceKm={worker.distanceKm}
              onPress={() => router.push({ pathname: '/worker/[id]', params: { id: worker.userId } })}
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
  postJobBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: palette.primary,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  bannerSubtitle: {
    color: '#d4ece4',
    fontSize: 12,
    marginTop: 2,
  },
  bannerButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  searchContainer: {
    backgroundColor: palette.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  searchInput: {
    fontSize: 15,
    color: palette.heading,
    paddingVertical: 8,
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
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f5',
    padding: 3,
    borderRadius: 10,
    marginTop: spacing.xs,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  modeButtonActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  modeButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.muted,
  },
  modeButtonTextActive: {
    color: palette.heading,
    fontWeight: '700',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 2,
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
  emptyActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  expandButton: {
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
  switchCityButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 20,
  },
  switchCityText: {
    color: palette.primary,
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
