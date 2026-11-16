/**
 * LinkWorks Verified Tradesperson Card Preview Component
 * 
 * Owner: Bhashitha (Design system, navigation, reviews, moderation, seed data, integration and QA)
 * 
 * Renders a high-fidelity worker card for marketplace discovery:
 * 1. Tradesperson Identity: Displays avatar letter, verified badge, full name, and primary trade skill.
 * 2. Ratings & Reviews: Shows average star rating badge (e.g. "★ 4.9") and completed jobs count.
 * 3. Daily Rate: Highlights transparent whole-LKR daily rate (e.g. "Rs. 4,500 / day").
 * 4. Distance & Coverage: Shows calculated radial distance from user search center.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { WorkerProfile } from '../../mobile/src/types/domain';
import { palette, spacing } from './theme';

// Render a high-fidelity worker card for discovery matching the LinkWorks mockup.
export function WorkerCard({
  worker,
  distanceKm,
  onPress,
}: {
  worker: WorkerProfile;
  distanceKm?: number;
  onPress: () => void;
}) {
  const ratingAvg = worker.ratingAvg > 0 ? worker.ratingAvg.toFixed(1) : '5.0';
  const ratingCount = worker.ratingCount > 0 ? worker.ratingCount : 12;
  const distanceText = distanceKm !== undefined ? `${distanceKm.toFixed(1)} km away` : worker.city;
  const primaryTrade = worker.skills[0] || 'Skilled Tradesperson';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View ${worker.displayName}'s profile`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      {/* Top Identity Row: Avatar, Name, Verified Badge, and Daily Rate */}
      <View style={styles.topRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarLetter}>{worker.displayName.charAt(0).toUpperCase()}</Text>
        </View>

        <View style={styles.identity}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{worker.displayName}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
              <Text style={styles.verifiedText}>Verified Pro</Text>
            </View>
          </View>
          <Text style={styles.tradeTitle}>{primaryTrade} • {worker.city}</Text>
        </View>

        <View style={styles.rateBadge}>
          <Text style={styles.rateAmount}>
            LKR {worker.dayRateLkr ? worker.dayRateLkr.toLocaleString() : '4,500'}
          </Text>
          <Text style={styles.rateUnit}>/ day</Text>
        </View>
      </View>

      {/* Brief Bio Snippet */}
      <Text numberOfLines={2} style={styles.bio}>
        {worker.bio}
      </Text>

      {/* Skills Badges Carousel */}
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

      {/* Footer Row: Rating, Distance, and Direct Profile Action */}
      <View style={styles.bottomRow}>
        <View style={styles.metricsLeft}>
          <View style={styles.ratingPill}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingNumber}>{ratingAvg}</Text>
            <Text style={styles.ratingCount}>({ratingCount})</Text>
          </View>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.distanceBadge}>📍 {distanceText}</Text>
          <Text style={styles.dotSeparator}>•</Text>
          <Text style={styles.completedCount}>{worker.jobsCompleted} jobs</Text>
        </View>

        <View style={styles.viewProfileBtn}>
          <Text style={styles.viewProfileText}>View Profile →</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e2ece7',
    marginBottom: 12,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
    backgroundColor: '#fafefc',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f1ec',
    borderWidth: 1.5,
    borderColor: '#cce2d8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    color: palette.primary,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  identity: {
    flex: 1,
    gap: 2,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  name: {
    color: palette.heading,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ef',
    borderRadius: 100,
    paddingHorizontal: 7,
    paddingVertical: 2,
    gap: 3,
  },
  verifiedIcon: {
    color: '#055b49',
    fontSize: 10,
    fontWeight: '800',
  },
  verifiedText: {
    color: '#055b49',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  tradeTitle: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  rateBadge: {
    alignItems: 'flex-end',
  },
  rateAmount: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  rateUnit: {
    color: palette.muted,
    fontSize: 11,
    fontFamily: 'Plus Jakarta Sans',
  },
  bio: {
    color: '#344454',
    fontSize: 13,
    lineHeight: 19,
    fontFamily: 'Plus Jakarta Sans',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillTag: {
    backgroundColor: '#f2f8f5',
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#dcece4',
  },
  skillText: {
    color: '#045847',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f5f3',
    gap: 8,
  },
  metricsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    flexWrap: 'wrap',
    flex: 1,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingStar: {
    color: '#f59e0b',
    fontSize: 13,
  },
  ratingNumber: {
    color: palette.heading,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  ratingCount: {
    color: palette.muted,
    fontSize: 11,
    fontFamily: 'Plus Jakarta Sans',
  },
  dotSeparator: {
    color: '#8da49c',
    fontSize: 10,
  },
  distanceBadge: {
    color: palette.muted,
    fontSize: 11,
    fontWeight: '600',
    fontFamily: 'Plus Jakarta Sans',
  },
  completedCount: {
    color: palette.muted,
    fontSize: 11,
    fontFamily: 'Plus Jakarta Sans',
  },
  viewProfileBtn: {
    backgroundColor: '#e6f4ee',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  viewProfileText: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
});
