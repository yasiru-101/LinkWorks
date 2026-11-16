/**
 * LinkWorks Client Home & Worker Discovery Screen
 * 
 * Owner: Pasindu (Categories, location service, nearby worker discovery, search, public worker profiles, optional map)
 * 
 * This screen is the primary landing experience for clients seeking tradespeople:
 * 1. Live Discovery: Queries Cloud Firestore `workerProfiles` where `isAvailable == true`.
 * 2. Spatial Filtering: Calculates Haversine distance from search center (GPS or chosen city) and filters by radius.
 * 3. Trade Category Chips: Filters by specific trade skills (Plumbing, Electrical, Carpentry, Masonry, etc.).
 * 4. Free-Text Search: Filters workers by name, skills, and bio description.
 * 5. View Switcher: Toggles between distance-sorted list view and interactive Google Static Map pin view.
 * 6. Quick Job Posting: Callout banner directing users to post multi-quote job requests.
 */

import { collection, getDocs, query, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CategoryChips, type TradeCategory } from '../../Bhashitha/Design/CategoryChips';
import { CitySelectorModal } from '../../Bhashitha/Design/CitySelectorModal';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { WorkerCard } from '../../Bhashitha/Design/WorkerCard';
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';
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

  // Load available verified workers directly from Cloud Firestore.
  const loadWorkers = useCallback(async () => {
    try {
      setError(null);
      const db = getSafeFirestore();
      const snapshot = await getDocs(
        query(collection(db, 'workerProfiles'), where('isAvailable', '==', true))
      );
      const list: WorkerProfile[] = snapshot.docs.map((doc) => doc.data() as WorkerProfile);

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
            <Text style={styles.eyebrow}>LINKWORKS MARKETPLACE</Text>
            <Text style={styles.heading}>Find Tradespeople</Text>
          </View>

          {/* Current City / GPS Pill */}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Select search city"
            onPress={() => setCityModalVisible(true)}
            style={[styles.cityPill, isGpsActive && styles.cityPillGps]}
          >
            <Text style={styles.cityPinIcon}>📍 </Text>
            <Text style={styles.cityText}>
              {isLocating ? 'Locating… ' : isGpsActive ? `${city} (GPS) ` : `${city} • ${radiusKm}km `}
            </Text>
            <Text style={styles.cityDropdownIcon}>▼</Text>
          </Pressable>
        </View>

        {/* Out of Coverage Notice Banner */}
        {isOutOfCoverage ? (
          <View style={styles.coverageNoticeCard}>
            <Text style={styles.coverageNoticeTitle}>🚧 Outside Standard Coverage Area</Text>
            <Text style={styles.coverageNoticeBody}>
              LinkWorks is actively expanding across Sri Lanka. Choose one of our supported hub cities below to browse verified tradespeople.
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => setCityModalVisible(true)}
              style={styles.coverageNoticeButton}
            >
              <Text style={styles.coverageNoticeButtonText}>📍 Select a Hub City</Text>
            </Pressable>
          </View>
        ) : null}

        {/* Search Bar with Search Icon */}
        <View style={styles.searchBarWrapper}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            placeholder="Search plumbers, electricians, carpenters…"
            placeholderTextColor="#8a9e96"
            value={searchText}
            onChangeText={setSearchText}
            style={styles.searchInput}
          />
          {searchText.length > 0 && (
            <Pressable onPress={() => setSearchText('')} style={styles.clearSearchBtn}>
              <Text style={styles.clearSearchText}>✕</Text>
            </Pressable>
          )}
        </View>

        {/* Category Horizontal Chips */}
        <CategoryChips selected={selectedCategory} onSelect={setSelectedCategory} />

        {/* Quick Post-a-Job Callout Banner */}
        <View style={styles.postJobBanner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Need quotes from multiple workers?</Text>
            <Text style={styles.bannerSubtitle}>
              Post your job details and verified pros will submit side-by-side prices.
            </Text>
          </View>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.push('/post-job')}
            style={({ pressed }) => [styles.bannerButton, pressed && { opacity: 0.85 }]}
          >
            <Text style={styles.bannerButtonText}>+ Post Job </Text>
          </Pressable>
        </View>

        {/* Section Header with List vs Map Segmented Pill */}
        <View style={styles.sectionHeaderRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.sectionTitle}>Nearby Verified Pros </Text>
            <Text style={styles.resultsLocation}>
              {workers.length} {workers.length === 1 ? 'tradesperson' : 'tradespeople'} found in {city}{' '}
            </Text>
          </View>

          {/* Segmented Switcher */}
          <View style={styles.viewModeToggle}>
            <Pressable
              onPress={() => setViewMode('list')}
              style={[styles.modeButton, viewMode === 'list' && styles.modeButtonActive]}
            >
              <Text style={[styles.modeButtonText, viewMode === 'list' && styles.modeButtonTextActive]}>
                List
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setViewMode('map')}
              style={[styles.modeButton, viewMode === 'map' && styles.modeButtonActive]}
            >
              <Text style={[styles.modeButtonText, viewMode === 'map' && styles.modeButtonTextActive]}>
                Map
              </Text>
            </Pressable>
          </View>
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
              There are no available {selectedCategory === 'All' ? '' : selectedCategory} workers within {radiusKm} km of {city}.{' '}
            </Text>
            <View style={styles.emptyActions}>
              <Pressable onPress={() => setRadiusKm(50)} style={styles.expandButton}>
                <Text style={styles.expandText}>Expand to 50 km </Text>
              </Pressable>
              <Pressable onPress={() => setCityModalVisible(true)} style={styles.switchCityButton}>
                <Text style={styles.switchCityText}>Change City </Text>
              </Pressable>
            </View>
          </View>
        ) : viewMode === 'map' ? (
          <WorkerMapView
            workers={workers}
            city={city}
            userCoords={{ lat, lng }}
            radiusKm={radiusKm}
            isGpsActive={isGpsActive}
            isLocating={isLocating}
            onRequestGps={requestDeviceLocation}
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
    paddingBottom: 140,
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
    gap: 5,
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#cde0d7',
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cityPillGps: {
    borderColor: '#86efac',
    backgroundColor: '#f0fdf4',
  },
  cityPinIcon: {
    fontSize: 13,
  },
  cityDropdownIcon: {
    fontSize: 9,
    color: palette.muted,
  },
  cityText: {
    color: palette.heading,
    fontSize: 12,
    fontWeight: '700',
    paddingRight: 8,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#d2e2db',
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 4,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: palette.heading,
    fontFamily: 'Plus Jakarta Sans',
    paddingVertical: 6,
  },
  clearSearchBtn: {
    padding: 4,
  },
  clearSearchText: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '700',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  sectionTitle: {
    color: palette.heading,
    fontSize: 17,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: '#e6f1ec',
    padding: 3,
    borderRadius: 100,
  },
  modeButton: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 100,
  },
  modeButtonActive: {
    backgroundColor: palette.primary,
  },
  modeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: palette.primary,
    fontFamily: 'Plus Jakarta Sans',
  },
  modeButtonTextActive: {
    color: '#ffffff',
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
    flexShrink: 0,
  },
  bannerButtonText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '700',
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
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  expandButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: palette.primary,
    borderRadius: 20,
  },
  expandText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 4,
  },
  switchCityButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: palette.primary,
    borderRadius: 20,
  },
  switchCityText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '700',
    paddingHorizontal: 4,
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
