import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import type { WorkerProfile } from '../../mobile/src/types/domain';
import type { SupportedCity } from './geo';

type WorkerWithDistance = WorkerProfile & { distanceKm: number };

interface WorkerMapViewProps {
  workers: WorkerWithDistance[];
  city: SupportedCity;
  radiusKm: number;
  onSelectWorker?: (worker: WorkerWithDistance) => void;
}

// Interactive cross-platform map card plotting nearby skilled tradespeople.
// Designed to run reliably without requiring native proprietary Google Play Services API keys.
export default function WorkerMapView({
  workers,
  city,
  radiusKm,
  onSelectWorker,
}: WorkerMapViewProps) {
  const [selectedWorkerId, setSelectedWorkerId] = useState<string>(
    workers[0]?.userId || ''
  );

  const selectedWorker = workers.find((w) => w.userId === selectedWorkerId) || workers[0];

  return (
    <View style={styles.container}>
      {/* Map Header with Radar/Compass indicator */}
      <View style={styles.mapHeader}>
        <View style={styles.mapHeaderLeft}>
          <Text style={styles.mapTitle}>🗺️ Radar &amp; Geo-Pins</Text>
          <Text style={styles.mapSubtitle}>
            Showing {workers.length} workers within {radiusKm} km of {city}
          </Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>GPS Active</Text>
        </View>
      </View>

      {/* Stylized Regional Trade Zone Canvas */}
      <View style={styles.canvasContainer}>
        {/* Background Grid & Range Rings */}
        <View style={styles.radarRingOuter} />
        <View style={styles.radarRingMiddle} />
        <View style={styles.radarRingInner} />
        <View style={styles.centerAxisHorizontal} />
        <View style={styles.centerAxisVertical} />

        {/* City Center Focal Pin */}
        <View style={styles.cityPin}>
          <Text style={styles.cityPinText}>📍 {city}</Text>
        </View>

        {/* Worker Pins Plotted in Zone */}
        {workers.slice(0, 8).map((worker, index) => {
          const isSelected = worker.userId === (selectedWorker?.userId || '');
          // Distribute pins organically based on index and distance
          const angle = (index * (360 / Math.min(workers.length, 8))) * (Math.PI / 180);
          const normalizedDist = Math.min(110, Math.max(35, (worker.distanceKm / (radiusKm || 25)) * 100));
          const pinX = Math.cos(angle) * normalizedDist;
          const pinY = Math.sin(angle) * normalizedDist;

          return (
            <Pressable
              key={worker.userId}
              onPress={() => {
                setSelectedWorkerId(worker.userId);
                if (onSelectWorker) onSelectWorker(worker);
              }}
              style={[
                styles.workerPin,
                { transform: [{ translateX: pinX }, { translateY: pinY }] },
                isSelected && styles.workerPinSelected,
              ]}
            >
              <Text style={styles.pinIcon}>
                {worker.skills[0] === 'Plumbing'
                  ? '🔧'
                  : worker.skills[0] === 'Carpentry'
                  ? '🪚'
                  : worker.skills[0] === 'Electrical'
                  ? '⚡'
                  : worker.skills[0] === 'Masonry'
                  ? '🧱'
                  : worker.skills[0] === 'Painting'
                  ? '🎨'
                  : '🛠️'}
              </Text>
              <View style={[styles.pinBadge, isSelected && styles.pinBadgeSelected]}>
                <Text style={[styles.pinBadgeText, isSelected && styles.pinBadgeTextSelected]}>
                  {worker.distanceKm.toFixed(1)} km
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Selected Worker Preview Sheet */}
      {selectedWorker ? (
        <View style={styles.previewCard}>
          <View style={styles.previewTop}>
            <View style={styles.workerAvatar}>
              <Text style={styles.avatarLetter}>
                {selectedWorker.displayName.charAt(0)}
              </Text>
            </View>
            <View style={styles.previewInfo}>
              <View style={styles.previewNameRow}>
                <Text style={styles.previewName}>{selectedWorker.displayName}</Text>
                <View style={styles.verifiedTag}>
                  <Text style={styles.verifiedTagText}>✓</Text>
                </View>
              </View>
              <Text style={styles.previewSkill}>
                {selectedWorker.skills.join(' • ')}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaRating}>
                  ⭐ {selectedWorker.ratingAvg ? selectedWorker.ratingAvg.toFixed(1) : 'New'} ({selectedWorker.ratingCount || 0})
                </Text>
                <Text style={styles.metaDot}>•</Text>
                <Text style={styles.metaDistance}>
                  📍 {selectedWorker.distanceKm.toFixed(1)} km away
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.previewBottom}>
            <View>
              <Text style={styles.rateLabel}>Daily Rate</Text>
              <Text style={styles.rateValue}>
                Rs. {selectedWorker.dayRateLkr?.toLocaleString() ?? 'Negotiable'}
              </Text>
            </View>
            <Pressable
              accessibilityRole="button"
              style={styles.hireButton}
              onPress={() =>
                router.push({
                  pathname: '/worker/[id]',
                  params: { id: selectedWorker.userId },
                })
              }
            >
              <Text style={styles.hireButtonText}>View Full Profile →</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.emptyMapBox}>
          <Text style={styles.emptyMapText}>No workers selected in this view area.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  mapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapHeaderLeft: {
    gap: 2,
  },
  mapTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: palette.heading,
  },
  mapSubtitle: {
    fontSize: 12,
    color: palette.muted,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#059669',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065f46',
  },
  canvasContainer: {
    height: 260,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  radarRingOuter: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderStyle: 'dashed',
  },
  radarRingMiddle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  radarRingInner: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: '#94a3b8',
    backgroundColor: 'rgba(2, 122, 72, 0.04)',
  },
  centerAxisHorizontal: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#e2e8f0',
  },
  centerAxisVertical: {
    position: 'absolute',
    height: '100%',
    width: 1,
    backgroundColor: '#e2e8f0',
  },
  cityPin: {
    position: 'absolute',
    backgroundColor: palette.heading,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 1,
  },
  cityPinText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  workerPin: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 5,
  },
  workerPinSelected: {
    zIndex: 10,
    transform: [{ scale: 1.15 }],
  },
  pinIcon: {
    fontSize: 20,
  },
  pinBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: palette.border,
    marginTop: -2,
  },
  pinBadgeSelected: {
    backgroundColor: palette.brand,
    borderColor: palette.brand,
  },
  pinBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: palette.heading,
  },
  pinBadgeTextSelected: {
    color: '#ffffff',
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.border,
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewTop: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6f7ef',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: palette.brand,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '800',
    color: palette.brand,
  },
  previewInfo: {
    flex: 1,
    gap: 2,
  },
  previewNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  previewName: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.heading,
  },
  verifiedTag: {
    backgroundColor: '#e6f7ef',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifiedTagText: {
    fontSize: 10,
    color: '#027a48',
    fontWeight: '800',
  },
  previewSkill: {
    fontSize: 13,
    color: palette.muted,
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaRating: {
    fontSize: 12,
    fontWeight: '700',
    color: '#b45309',
  },
  metaDot: {
    fontSize: 12,
    color: palette.muted,
  },
  metaDistance: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.muted,
  },
  previewBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.border,
    paddingTop: spacing.xs,
  },
  rateLabel: {
    fontSize: 11,
    color: palette.muted,
  },
  rateValue: {
    fontSize: 15,
    fontWeight: '800',
    color: palette.brand,
  },
  hireButton: {
    backgroundColor: palette.brand,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  hireButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  emptyMapBox: {
    padding: spacing.md,
    alignItems: 'center',
  },
  emptyMapText: {
    color: palette.muted,
    fontSize: 13,
  },
});
