/**
 * LinkWorks Job Card Preview Component
 * 
 * Owner: Bhashitha (Design system, navigation, reviews, moderation, seed data, integration and QA)
 * 
 * Renders an elevated job summary card:
 * 1. Trade Category & Status: Displays color-coded status badge ('Open for Quotes', 'Assigned', 'In Progress', etc.).
 * 2. Budget Display: Formats positive whole-LKR budget range (e.g. "Rs. 4,500 - 8,000").
 * 3. Radial Distance: Shows calculated km distance from the user's active search center.
 * 4. Location & Title: Displays city / address and prominent title.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Job } from '../../mobile/src/types/domain';
import { palette, spacing } from './theme';

// Map job status to user-friendly label and color badge.
function getStatusStyle(status: Job['status']) {
  switch (status) {
    case 'open':
      return { label: 'Open for Quotes', bg: '#e6f7ef', text: '#027a48' };
    case 'assigned':
      return { label: 'Assigned', bg: '#eff8ff', text: '#175cd3' };
    case 'in_progress':
      return { label: 'In Progress', bg: '#fef6ee', text: '#b54708' };
    case 'completed':
      return { label: 'Completed', bg: '#f4f3ff', text: '#5925dc' };
    case 'cancelled':
      return { label: 'Cancelled', bg: '#fef3f2', text: '#b42318' };
    default:
      return { label: status, bg: '#f2f4f7', text: '#344054' };
  }
}

// Render an elevated job card matching LinkWorks design specifications.
export function JobCard({
  job,
  distanceKm,
  onPress,
}: {
  job: Job & { id?: string };
  distanceKm?: number;
  onPress: () => void;
}) {
  const statusInfo = getStatusStyle(job.status);
  const budgetText =
    job.budgetMinLkr && job.budgetMaxLkr
      ? `LKR ${job.budgetMinLkr.toLocaleString()} – ${job.budgetMaxLkr.toLocaleString()}`
      : job.budgetMaxLkr
      ? `Up to LKR ${job.budgetMaxLkr.toLocaleString()}`
      : 'Negotiable Budget';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`View job ${job.title}`}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>🛠️ {job.categoryId.toUpperCase()}</Text>
          </View>
          <Text style={styles.title} numberOfLines={2}>{job.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {job.description}
      </Text>

      {/* Budget and Location Pills */}
      <View style={styles.metaRow}>
        <View style={styles.budgetBox}>
          <Text style={styles.budgetLabel}>Budget:</Text>
          <Text style={styles.budgetValue}>{budgetText}</Text>
        </View>

        {distanceKm !== undefined ? (
          <View style={styles.distanceBox}>
            <Text style={styles.distanceText}>📍 {distanceKm.toFixed(1)} km away</Text>
          </View>
        ) : (
          <View style={styles.distanceBox}>
            <Text style={styles.distanceText} numberOfLines={1}>📍 {job.addressText}</Text>
          </View>
        )}
      </View>

      {/* Footer: Preferred Timing & Quotes Count */}
      <View style={styles.footer}>
        <Text style={styles.preferredDate}>
          📅 {job.preferredDate ? `Needed by ${job.preferredDate}` : 'Flexible timing'}
        </Text>

        <View style={styles.applyActionRow}>
          <Text style={styles.quotesCount}>
            {job.applicationCount || 0} quotes
          </Text>
          <View style={styles.applyButtonPill}>
            <Text style={styles.applyButtonText}>Details →</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    gap: 10,
    borderWidth: 1.5,
    borderColor: '#e2ece7',
    marginBottom: 12,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  pressed: {
    opacity: 0.92,
    backgroundColor: '#fafefc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },
  titleArea: {
    flex: 1,
    gap: 6,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f8f5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dcece4',
  },
  categoryText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '800',
    color: palette.primary,
  },
  title: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
    color: palette.heading,
    lineHeight: 22,
  },
  statusBadge: {
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '800',
  },
  description: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: '#344454',
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
    flexWrap: 'wrap',
  },
  budgetBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#f0f8f4',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d2e5dc',
  },
  budgetLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: palette.muted,
  },
  budgetValue: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '800',
    color: palette.primary,
  },
  distanceBox: {
    backgroundColor: '#f8faf9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8f0ec',
  },
  distanceText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: palette.muted,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f5f2',
  },
  preferredDate: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#657e76',
  },
  applyActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  quotesCount: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: palette.muted,
    fontWeight: '600',
  },
  applyButtonPill: {
    backgroundColor: '#eaf4f0',
    borderRadius: 100,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  applyButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    color: palette.primary,
  },
});
