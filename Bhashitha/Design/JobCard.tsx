import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Job } from '../../mobile/src/types/domain';
import { palette, spacing } from './theme';

// Map job status to user-friendly label and color badge.
function getStatusStyle(status: Job['status']) {
  switch (status) {
    case 'open':
      return { label: 'Open', bg: '#e6f7ef', text: '#027a48' };
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

// Render a job card for client's My Jobs or worker's Feed with budget, distance, and status.
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
      ? `Rs. ${job.budgetMinLkr.toLocaleString()} – ${job.budgetMaxLkr.toLocaleString()}`
      : job.budgetMaxLkr
      ? `Up to Rs. ${job.budgetMaxLkr.toLocaleString()}`
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
          <Text style={styles.category}>{job.categoryId.toUpperCase()}</Text>
          <Text style={styles.title}>{job.title}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
          <Text style={[styles.statusText, { color: statusInfo.text }]}>{statusInfo.label}</Text>
        </View>
      </View>

      <Text numberOfLines={2} style={styles.description}>
        {job.description}
      </Text>

      <View style={styles.metaRow}>
        <Text style={styles.budget}>{budgetText}</Text>
        {distanceKm !== undefined ? (
          <Text style={styles.distance}>{distanceKm.toFixed(1)} km away</Text>
        ) : (
          <Text style={styles.location}>{job.addressText}</Text>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.preferredDate}>
          📅 {job.preferredDate ? `Needed by ${job.preferredDate}` : 'Flexible timing'}
        </Text>
        <Text style={styles.applications}>
          {job.applicationCount} {job.applicationCount === 1 ? 'quote' : 'quotes'}
        </Text>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  titleArea: {
    flex: 1,
    gap: 2,
  },
  category: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  title: {
    color: palette.heading,
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: '#344454',
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  budget: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  distance: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  location: {
    color: palette.muted,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#f0f5f3',
  },
  preferredDate: {
    color: palette.muted,
    fontSize: 12,
  },
  applications: {
    color: palette.heading,
    fontSize: 12,
    fontWeight: '600',
  },
});
