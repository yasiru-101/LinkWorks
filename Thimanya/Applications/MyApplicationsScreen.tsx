/**
 * LinkWorks Worker My Applications & Quotes Screen
 * 
 * Owner: Thimanya (Nearby job feed, job posting, applications, quotes, assignment, job lifecycle)
 * 
 * This screen provides tracking for quotes submitted by the authenticated worker:
 * 1. CollectionGroup Query: Queries across all `applications` subcollections matching `workerId == user.uid`.
 * 2. Parent Job Metadata: Concurrently resolves parent job titles, trade categories, and locations.
 * 3. Bid Status Badges: Visual state tags for 'Quote Submitted', 'Hired / Accepted', 'Not Selected', and 'Withdrawn'.
 * 4. Quote Withdrawal: Allows workers to retract active quotes prior to client assignment.
 */

import { collectionGroup, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Action, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import type { ApplicationStatus } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';

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

// Worker screen showing all jobs applied to and bid status tracking powered by Cloud Firestore.
export default function MyApplicationsScreen() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<WorkerApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busyJobId, setBusyJobId] = useState<string | null>(null);

  // Load worker's applications across all jobs using collectionGroup directly from Cloud Firestore.
  const loadApplications = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const db = getSafeFirestore();
      const snapshot = await getDocs(
        query(collectionGroup(db, 'applications'), where('workerId', '==', user.uid))
      );
      // Fetch parent job titles and details concurrently so cards render rich job information
      const list: WorkerApplicationItem[] = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();
          const parentJobRef = docSnap.ref.parent.parent;
          const parentJobId = parentJobRef ? parentJobRef.id : 'unknown';
          let jobTitle = data.jobTitle || 'Skilled Trade Job';
          let categoryId = data.categoryId || 'Trade';
          let addressText = data.addressText || 'Sri Lanka';

          if (parentJobRef) {
            try {
              const jobSnap = await getDoc(parentJobRef);
              if (jobSnap.exists()) {
                const jobData = jobSnap.data();
                if (jobData?.title) jobTitle = jobData.title;
                if (jobData?.categoryId) categoryId = jobData.categoryId;
                if (jobData?.addressText) addressText = jobData.addressText;
              }
            } catch {
              // Non-critical fallback if parent job read is restricted
            }
          }

          return {
            jobId: parentJobId,
            jobTitle,
            categoryId,
            addressText,
            quotedPriceLkr: data.quotedPriceLkr || 0,
            message: data.message || '',
            status: data.status || 'submitted',
          };
        })
      );
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

  // Withdraw quote with confirmation dialog so workers don't accidentally forfeit active bids.
  function confirmWithdrawQuote(jobId: string) {
    Alert.alert(
      'Withdraw Quote',
      'Are you sure you want to withdraw your quote for this job? The client will no longer be able to accept it.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Withdraw',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              setBusyJobId(jobId);
              setError(null);
              await updateDoc(doc(getSafeFirestore(), 'jobs', jobId, 'applications', user.uid), {
                status: 'withdrawn',
                updatedAt: serverTimestamp(),
              });
              setApplications((prev) =>
                prev.map((app) => (app.jobId === jobId ? { ...app, status: 'withdrawn' } : app))
              );
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not withdraw quote.');
            } finally {
              setBusyJobId(null);
            }
          },
        },
      ]
    );
  }

  // Permanently delete a quote document from Firestore with confirmation.
  function confirmDeleteQuote(jobId: string) {
    Alert.alert(
      'Delete Quote',
      'Are you sure you want to permanently delete this quote record?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (!user) return;
            try {
              setBusyJobId(jobId);
              setError(null);
              await deleteDoc(doc(getSafeFirestore(), 'jobs', jobId, 'applications', user.uid));
              setApplications((prev) => prev.filter((app) => app.jobId !== jobId));
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Could not delete quote.');
            } finally {
              setBusyJobId(null);
            }
          },
        },
      ]
    );
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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Retry loading applications"
              onPress={loadApplications}
              style={styles.retryButton}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </Pressable>
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
                      disabled={busyJobId === app.jobId}
                      onPress={() => confirmWithdrawQuote(app.jobId)}
                      style={[styles.withdrawButton, busyJobId === app.jobId && { opacity: 0.5 }]}
                    >
                      <Text style={styles.withdrawButtonText}>Withdraw</Text>
                    </Pressable>
                  ) : null}

                  {app.status !== 'accepted' ? (
                    <Pressable
                      accessibilityRole="button"
                      disabled={busyJobId === app.jobId}
                      onPress={() => confirmDeleteQuote(app.jobId)}
                      style={[styles.deleteButton, busyJobId === app.jobId && { opacity: 0.5 }]}
                    >
                      <Text style={styles.deleteButtonText}>🗑 Delete</Text>
                    </Pressable>
                  ) : null}

                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push({ pathname: '/job/[id]', params: { id: app.jobId } })}
                    style={styles.viewJobButton}
                  >
                    <Text style={styles.viewJobText}>View Details →</Text>
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
    paddingBottom: 140,
  },
  header: {
    marginBottom: spacing.xs,
  },
  eyebrow: {
    fontFamily: 'Plus Jakarta Sans',
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
    fontFamily: 'Plus Jakarta Sans',
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
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  priceLabel: {
    fontFamily: 'Plus Jakarta Sans',
    color: palette.muted,
    fontSize: 13,
  },
  priceValue: {
    fontFamily: 'Plus Jakarta Sans',
    color: palette.primary,
    fontSize: 17,
    fontWeight: '800',
  },
  pitchText: {
    fontFamily: 'Plus Jakarta Sans',
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
    fontFamily: 'Plus Jakarta Sans',
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  withdrawButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  withdrawButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    color: palette.danger,
    fontSize: 13,
    fontWeight: '600',
  },
  deleteButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  deleteButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    color: '#b42318',
    fontSize: 13,
    fontWeight: '600',
  },
  viewJobButton: {
    marginLeft: 'auto',
    paddingVertical: 8,
  },
  viewJobText: {
    fontFamily: 'Plus Jakarta Sans',
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
    fontFamily: 'Plus Jakarta Sans',
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
    fontFamily: 'Plus Jakarta Sans',
    color: palette.danger,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: palette.primary,
    backgroundColor: '#ffffff',
    marginTop: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    color: palette.primary,
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
});
