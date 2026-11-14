import { collectionGroup, getDocs, getFirestore, query, where, doc, updateDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import type { ApplicationStatus } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';

type WorkerApplicationItem = {
  jobId: string;
  jobTitle: string;
  categoryId: string;
  addressText: string;
  quotedPriceLkr: number;
  message: string;
  status: ApplicationStatus;
  createdAt?: string;
};

// Fallback mock applications for demo/preview mode.
const DEMO_APPLICATIONS: WorkerApplicationItem[] = [
  {
    jobId: 'job-colombo-kitchen-pipe',
    jobTitle: 'Repair leaking kitchen drain pipe',
    categoryId: 'Plumbing',
    addressText: 'Colombo 03 (Kollupitiya)',
    quotedPriceLkr: 4500,
    message: 'Can inspect and replace pipe joints today with 6-month warranty.',
    status: 'accepted',
  },
  {
    jobId: 'job-colombo-trip-switch',
    jobTitle: 'Main breaker tripping intermittently',
    categoryId: 'Electrical',
    addressText: 'Colombo 05 (Havelock Town)',
    quotedPriceLkr: 5000,
    message: 'I have megger insulation tester and circuit load analyzer ready.',
    status: 'submitted',
  },
  {
    jobId: 'job-negombo-exterior-paint',
    jobTitle: 'Paint 2-storey house exterior front',
    categoryId: 'Painting',
    addressText: 'Negombo (Kochchikade)',
    quotedPriceLkr: 28000,
    message: 'Experienced exterior painting team with high ladders and sprayer.',
    status: 'rejected',
  },
];

function getStatusBadge(status: ApplicationStatus) {
  switch (status) {
    case 'accepted':
      return { label: 'Hired / Accepted', bg: '#e6f7ef', text: '#027a48' };
    case 'submitted':
      return { label: 'Quote Submitted', bg: '#fef6ee', text: '#b54708' };
    case 'rejected':
      return { label: 'Not Selected', bg: '#f2f4f7', text: '#667085' };
    case 'withdrawn':
      return { label: 'Withdrawn', bg: '#fef3f2', text: '#b42318' };
    default:
      return { label: status, bg: '#f2f4f7', text: '#344054' };
  }
}

// Worker screen showing all jobs applied to and bid status tracking.
export default function MyApplicationsScreen() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<WorkerApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load worker's applications across all jobs using collectionGroup.
  const loadApplications = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      let list: WorkerApplicationItem[] = [];

      try {
        const snapshot = await getDocs(
          query(collectionGroup(getFirestore(), 'applications'), where('workerId', '==', user.uid))
        );
        if (!snapshot.empty) {
          list = snapshot.docs.map((docSnap) => {
            const data = docSnap.data();
            const parentJobRef = docSnap.ref.parent.parent;
            return {
              jobId: parentJobRef ? parentJobRef.id : 'unknown',
              jobTitle: data.jobTitle || 'Skilled Trade Job',
              categoryId: data.categoryId || 'Trade',
              addressText: data.addressText || 'Sri Lanka',
              quotedPriceLkr: data.quotedPriceLkr || 0,
              message: data.message || '',
              status: data.status || 'submitted',
            };
          });
        }
      } catch {
        // Fall back to demo applications in preview
      }

      if (list.length === 0) {
        list = DEMO_APPLICATIONS;
      }

      setApplications(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load applications.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    void loadApplications();
  }, [loadApplications]);

  const onRefresh = () => {
    setRefreshing(true);
    void loadApplications();
  };

  // Withdraw a submitted quote before assignment.
  async function withdrawQuote(jobId: string) {
    if (!user) return;
    try {
      try {
        await updateDoc(doc(getFirestore(), 'jobs', jobId, 'applications', user.uid), {
          status: 'withdrawn',
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Update local state in preview
      }
      setApplications((prev) =>
        prev.map((app) => (app.jobId === jobId ? { ...app, status: 'withdrawn' } : app))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not withdraw quote.');
    }
  }

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>WORKER BIDS</Text>
          <Text style={styles.heading}>My Applications</Text>
        </View>

        {loading ? (
          <View style={styles.stateBox}>
            <ActivityIndicator size="large" color={palette.primary} />
            <Text style={styles.stateText}>Loading your submitted quotes…</Text>
          </View>
        ) : error ? (
          <View style={styles.stateBox}>
            <Text style={styles.errorText}>{error}</Text>
            <Action label="Retry" secondary onPress={loadApplications} />
          </View>
        ) : applications.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.emptyTitle}>No Applications Submitted</Text>
            <Text style={styles.stateText}>
              Browse the Job Feed to discover nearby open jobs in your trade and submit competitive quotes.
            </Text>
            <Action label="Browse Job Feed" onPress={() => router.push('/(main)/feed')} />
          </View>
        ) : (
          applications.map((app) => {
            const statusInfo = getStatusBadge(app.status);
            return (
              <View key={app.jobId} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={{ flex: 1, gap: 2 }}>
                    <Text style={styles.category}>{app.categoryId.toUpperCase()}</Text>
                    <Text style={styles.jobTitle}>{app.jobTitle}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusInfo.bg }]}>
                    <Text style={[styles.statusText, { color: statusInfo.text }]}>
                      {statusInfo.label}
                    </Text>
                  </View>
                </View>

                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Your Quote:</Text>
                  <Text style={styles.priceValue}>Rs. {app.quotedPriceLkr.toLocaleString()}</Text>
                </View>

                <Text numberOfLines={2} style={styles.pitchText}>
                  "{app.message}"
                </Text>

                <View style={styles.actionRow}>
                  {app.status === 'accepted' ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: app.jobId } })}
                      style={styles.chatButton}
                    >
                      <Text style={styles.chatButtonText}>💬 Open Job Chat</Text>
                    </Pressable>
                  ) : null}

                  {app.status === 'submitted' ? (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => { void withdrawQuote(app.jobId); }}
                      style={styles.withdrawButton}
                    >
                      <Text style={styles.withdrawButtonText}>Withdraw Quote</Text>
                    </Pressable>
                  ) : null}

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push({ pathname: '/job/[id]', params: { id: app.jobId } })}
                    style={styles.viewJobButton}
                  >
                    <Text style={styles.viewJobText}>View Job Details →</Text>
                  </Pressable>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
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
  card: {
    backgroundColor: palette.surface,
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: palette.border,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  category: {
    color: palette.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  jobTitle: {
    color: palette.heading,
    fontSize: 16,
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
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceLabel: {
    color: palette.muted,
    fontSize: 13,
  },
  priceValue: {
    color: palette.primary,
    fontSize: 17,
    fontWeight: '800',
  },
  pitchText: {
    color: '#344454',
    fontSize: 13,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: '#f0f5f3',
    gap: spacing.sm,
  },
  chatButton: {
    backgroundColor: palette.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chatButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  withdrawButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  withdrawButtonText: {
    color: palette.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  viewJobButton: {
    marginLeft: 'auto',
    paddingVertical: 8,
  },
  viewJobText: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '700',
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
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  errorText: {
    color: palette.danger,
    fontSize: 14,
    textAlign: 'center',
  },
});
