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

const RADIUS_OPTIONS = [5, 10, 15, 25, 50];

// Main Client Home Screen providing automatic distance-sorted nearby worker discovery.
export default function ClientHomeScreen() {
  const { city, lat, lng, radiusKm, setCity, setRadiusKm } = useSearchCenter();
  const [selectedCategory, setSelectedCategory] = useState<TradeCategory>('All');
  const [searchText, setSearchText] = useState('');
  const [workers, setWorkers] = useState<Array<WorkerProfile & { distanceKm: number }>>([]);
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

  const onRefresh = () => {
    setRefreshing(true);
    void loadWorkers();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header Bar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>LINKWORKS</Text>
            <Text style={styles.heading}>Find Tradespeople</Text>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Current city ${city}. Tap to change.`}
            onPress={() => setCityModalVisible(true)}
            style={styles.cityPill}
          >
            <Text style={styles.cityIcon}>📍</Text>
            <Text style={styles.cityText}>{city}</Text>
          </Pressable>
        </View>

        {/* Post a Job Shortcut CTA */}
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/post-job')}
          style={styles.postJobBanner}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Need work done quickly?</Text>
            <Text style={styles.bannerSubtitle}>Post a job with your budget and receive quotes</Text>
          </View>
          <View style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Post Job</Text>
          </View>
        </Pressable>

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

        {/* Results Count & Title */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsTitle}>
            Available Workers ({workers.length})
          </Text>
          <Text style={styles.resultsLocation}>
            within {radiusKm} km of {city}
          </Text>
        </View>

        {/* List of Workers or Empty/Loading State */}
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
            <Pressable onPress={() => setRadiusKm(50)} style={styles.expandButton}>
              <Text style={styles.expandText}>Expand search to 50 km</Text>
            </Pressable>
          </View>
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

      {/* City Switcher Modal */}
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
