import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { WorkerProfile } from '../../mobile/src/types/domain';
import { palette, spacing } from './theme';

// Render a worker card for search results with distance, rating, daily rate, and skills.
export function WorkerCard({
  worker,
  distanceKm,
  onPress,
}: {
  worker: WorkerProfile;
  distanceKm?: number;
  onPress: () => void;
}) {
  const ratingText = worker.ratingCount > 0 ? `${worker.ratingAvg.toFixed(1)} ★ (${worker.ratingCount})` : 'New Worker';
  const distanceText = distanceKm !== undefined ? `${distanceKm.toFixed(1)} km away` : worker.city;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${worker.displayName}'s profile`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{worker.displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.identity}>
          <Text style={styles.name}>{worker.displayName}</Text>
          <Text style={styles.distance}>{distanceText}</Text>
        </View>
        <View style={styles.rateBadge}>
          <Text style={styles.rateAmount}>
            Rs. {worker.dayRateLkr ? worker.dayRateLkr.toLocaleString() : 'Negotiable'}
          </Text>
          <Text style={styles.rateUnit}>/ day</Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.bio}>
        {worker.bio}
      </Text>

      <View style={styles.skillsRow}>
        {worker.skills.slice(0, 3).map((skill) => (
          <View key={skill} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {worker.skills.length > 3 ? (
          <View style={styles.skillTag}>
            <Text style={styles.skillText}>+{worker.skills.length - 3}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.bottomRow}>
        <Text style={styles.rating}>{ratingText}</Text>
        <Text style={styles.completedCount}>{worker.jobsCompleted} jobs completed</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
    marginBottom: spacing.xs,
  },
  pressed: {
    opacity: 0.9,
    backgroundColor: '#fafefc',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6f1ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: palette.primary,
    fontSize: 18,
    fontWeight: '800',
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: palette.heading,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  distance: {
    color: palette.muted,
    fontSize: 13,
  },
  rateBadge: {
    alignItems: 'flex-end',
  },
  rateAmount: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  rateUnit: {
    color: palette.muted,
    fontSize: 11,
  },
  bio: {
    color: '#344454',
    fontSize: 13,
    lineHeight: 18,
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: palette.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: palette.border,
  },
  skillText: {
    color: palette.heading,
    fontSize: 12,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#f0f5f3',
  },
  rating: {
    color: '#b56d00',
    fontSize: 13,
    fontWeight: '700',
  },
  completedCount: {
    color: palette.muted,
    fontSize: 12,
  },
});
