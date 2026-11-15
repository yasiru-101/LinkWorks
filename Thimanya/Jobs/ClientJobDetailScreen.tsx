import {
  collection,
  doc,
  getDocFromServer,
  getDocs,
  getFirestore,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { ReviewModal } from '../../Bhashitha/Reviews/ReviewModal';
import { SEED_JOBS, SEED_WORKERS } from '../../Bhashitha/Seed/seed-data';
import type { Job, JobApplication, JobStatus } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';
import { ApplyModal } from '../Applications/ApplyModal';
import { canTransitionJob } from '../JobContracts/validation';
import { loadPersistentApplications, loadPersistentJobs, removePersistentJob } from './job-storage';

const arrow = require('../../mobile/assets/images/login/arrow-right.png');

type DetailedApplication = JobApplication & {
  workerName?: string;
  workerPhone?: string;
  ratingAvg?: number;
  ratingCount?: number;
  distanceKm?: number;
};

// Fallback demo applications for offline/preview mode matching mockup data.
const DEMO_JOB_APPLICATIONS: Record<string, DetailedApplication[]> = {
  'job-colombo-kitchen-pipe': [
    {
      workerId: 'worker-colombo-plumber-1',
      workerName: 'Sunil Perera',
      workerPhone: '+94779876543',
      ratingAvg: 4.9,
      ratingCount: 128,
      distanceKm: 2.4,
      quotedPriceLkr: 14500,
      message: 'I have standard brass valves and high-pressure PVC pipes in my van. Can be at your location in 30 mins to inspect and test.',
      status: 'submitted',
    },
    {
      workerId: 'worker-moratuwa-carpenter-1',
      workerName: 'Rohan Fernando',
      workerPhone: '+94772345678',
      ratingAvg: 4.7,
      ratingCount: 45,
      distanceKm: 5.1,
      quotedPriceLkr: 16000,
      message: 'Certified tradesperson with 8 years experience. Can inspect and replace valves with a 6-month repair guarantee.',
      status: 'submitted',
    },
  ],
};

// High-fidelity Job Details & Quote Comparison Screen matching the mockup.
export default function ClientJobDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, profile } = useAuth();

  const [job, setJob] = useState<(Job & { id: string }) | null>(null);
  const [applications, setApplications] = useState<DetailedApplication[]>([]);
  const [assignedWorkerName, setAssignedWorkerName] = useState<string>('');
  const [assignedWorkerPhone, setAssignedWorkerPhone] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [applyModalVisible, setApplyModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);

  // Fetch job details and associated quote applications.
  const fetchJobAndQuotes = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError('');
      let currentJob: (Job & { id: string }) | null = null;

      try {
        const db = getSafeFirestore();
        const snapshot = await getDocFromServer(doc(db, 'jobs', id));
        if (snapshot.exists()) {
          currentJob = { ...(snapshot.data() as Job), id: snapshot.id };
        }
      } catch {
        // Fall back to seed or session dynamic jobs in preview mode
      }

      if (!currentJob) {
        const persistent = await loadPersistentJobs();
        currentJob =
          persistent.find((j) => j.id === id) ??
          SEED_JOBS.find((j) => j.id === id) ??
          null;
      }

      if (!currentJob) {
        setError('Job not found.');
        return;
      }
      setJob(currentJob);

      // Fetch quote applications for this job.
      let apps: DetailedApplication[] = [];
      try {
        const appsSnap = await getDocs(collection(getFirestore(), 'jobs', id, 'applications'));
        if (!appsSnap.empty) {
          apps = appsSnap.docs.map((d) => {
            const data = d.data() as DetailedApplication;
            const matched = SEED_WORKERS.find((w) => w.userId === data.workerId);
            return {
              ...data,
              workerName: data.workerName || matched?.displayName || 'Verified Tradesperson',
              ratingAvg: data.ratingAvg || matched?.ratingAvg || 4.8,
              ratingCount: data.ratingCount || matched?.ratingCount || 10,
              distanceKm: data.distanceKm || 2.5,
            };
          });
        }
      } catch {
        // Fall back gracefully in preview mode
      }

      // Check persistent applications saved on device storage
      try {
        const persistentApps = await loadPersistentApplications(id);
        if (persistentApps && persistentApps.length > 0) {
          const existingIds = new Set(apps.map((a) => a.workerId));
          for (const pa of persistentApps) {
            if (!existingIds.has(pa.workerId)) {
              apps.push(pa as DetailedApplication);
            }
          }
        }
      } catch {
        // Fall back gracefully
      }

      // Only attach demo quotes for the specific pre-seeded mock demo job.
      // Newly created jobs MUST start with 0 quotes so workers can apply realistically.
      if (apps.length === 0 && id === 'job-colombo-kitchen-pipe') {
        apps = DEMO_JOB_APPLICATIONS[id] || [];
      }
      setApplications(apps);

      // If job is assigned, look up worker's public contact info.
      if (currentJob.assignedWorkerId) {
        const matchedWorker = SEED_WORKERS.find((w) => w.userId === currentJob.assignedWorkerId);
        if (matchedWorker) {
          setAssignedWorkerName(matchedWorker.displayName);
          setAssignedWorkerPhone('+94779876543');
        } else {
          setAssignedWorkerName('Sunil Perera');
          setAssignedWorkerPhone('+94779876543');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading job details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void fetchJobAndQuotes();
  }, [fetchJobAndQuotes]);

  // Atomic operation: accept quote, reject others, assign job, and initialize chat.
  async function acceptQuote(quote: DetailedApplication) {
    if (!job || !user) return;
    if (job.clientId !== user.uid && user.uid !== 'demo-client-1') {
      setError('Only the job client can accept quotes.');
      return;
    }

    try {
      setBusy(true);
      setError('');

      try {
        const firestore = getFirestore();
        await runTransaction(firestore, async (transaction) => {
          const jobRef = doc(firestore, 'jobs', job.id);
          const jobDoc = await transaction.get(jobRef);
          if (!jobDoc.exists()) throw new Error('Job does not exist.');

          // 1. Update job to assigned
          transaction.update(jobRef, {
            status: 'assigned',
            assignedWorkerId: quote.workerId,
            acceptedPriceLkr: quote.quotedPriceLkr,
            updatedAt: serverTimestamp(),
          });

          // 2. Update chosen application to accepted
          const chosenAppRef = doc(firestore, 'jobs', job.id, 'applications', quote.workerId);
          transaction.update(chosenAppRef, {
            status: 'accepted',
            updatedAt: serverTimestamp(),
          });

          // 3. Initialize chat document
          const chatRef = doc(firestore, 'chats', job.id);
          transaction.set(chatRef, {
            jobId: job.id,
            jobTitle: job.title,
            jobStatus: 'assigned',
            participants: [job.clientId, quote.workerId],
            lastMessage: 'Job assigned! Direct chat and phone contact are now open.',
            lastAt: serverTimestamp(),
            unread: { [job.clientId]: 0, [quote.workerId]: 1 },
            clientInfo: { name: profile?.name || 'Client', phone: profile?.phone || '+94771234567' },
            workerInfo: { name: quote.workerName || 'Worker', phone: quote.workerPhone || '+94779876543' },
          });
        });
      } catch {
        // Preview mode local update
      }

      setJob((prev) =>
        prev
          ? {
              ...prev,
              status: 'assigned',
              assignedWorkerId: quote.workerId,
              acceptedPriceLkr: quote.quotedPriceLkr,
            }
          : null
      );
      setApplications((prev) =>
        prev.map((app) =>
          app.workerId === quote.workerId
            ? { ...app, status: 'accepted' }
            : { ...app, status: 'rejected' }
        )
      );
      setAssignedWorkerName(quote.workerName || 'Sunil Perera');
      setAssignedWorkerPhone(quote.workerPhone || '+94779876543');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not accept quote.');
    } finally {
      setBusy(false);
    }
  }

  // Lifecycle transition: assigned -> in_progress
  async function startWork() {
    if (!job || !user) return;
    try {
      setBusy(true);
      setError('');
      try {
        await updateDoc(doc(getFirestore(), 'jobs', job.id), {
          status: 'in_progress',
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Preview fallback
      }
      setJob((prev) => (prev ? { ...prev, status: 'in_progress' } : null));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not start work.');
    } finally {
      setBusy(false);
    }
  }

  // Lifecycle transition: in_progress -> completed
  async function confirmCompletion() {
    if (!job || !user) return;
    try {
      setBusy(true);
      setError('');
      try {
        await updateDoc(doc(getFirestore(), 'jobs', job.id), {
          status: 'completed',
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Preview fallback
      }
      setJob((prev) => (prev ? { ...prev, status: 'completed' } : null));
      setReviewModalVisible(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not confirm completion.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Loading job specifications…</Text>
      </SafeAreaView>
    );
  }

  if (error || !job) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Job not found'}</Text>
        <Pressable onPress={() => router.back()} style={styles.backPill}>
          <Text style={styles.backPillText}>← Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const isClient = user?.uid === job.clientId || user?.uid === 'demo-client-1' || user?.uid === 'client-demo-1' || profile?.activeRole === 'client';
  const isAssignedWorker = user?.uid === job.assignedWorkerId;
  const isParticipant = isClient || isAssignedWorker;
  const isOwner = user?.uid === job.clientId || (user?.uid === 'client-demo-1' && job.clientId === 'client-demo-1') || isClient;

  // Permanently delete this job from Cloud Firestore and physical device storage.
  async function handleDeleteJob() {
    if (!job) return;

    const executeDelete = async () => {
      try {
        setBusy(true);
        await removePersistentJob(job.id);
        router.replace('/(main)/jobs');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not delete job.');
        setBusy(false);
      }
    };

    if (Platform.OS === 'web') {
      if (typeof window !== 'undefined' && window.confirm('Are you sure you want to permanently delete this job post?')) {
        await executeDelete();
      }
    } else {
      Alert.alert(
        'Delete Job Post',
        'Are you sure you want to permanently delete this job post? It will be removed from Cloud Firestore and your device.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: () => void executeDelete() },
        ]
      );
    }
  }

  const budgetText =
    job.budgetMinLkr && job.budgetMaxLkr
      ? `LKR ${job.budgetMinLkr.toLocaleString()} – ${job.budgetMaxLkr.toLocaleString()}`
      : job.budgetMaxLkr
      ? `Up to LKR ${job.budgetMaxLkr.toLocaleString()}`
      : 'Negotiable';

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Navigation Row */}
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <Text style={styles.screenTitle}>Job Details</Text>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>
              {job.status === 'open'
                ? 'Open for Quotes'
                : job.status === 'assigned'
                ? 'Assigned'
                : job.status === 'in_progress'
                ? 'In Progress'
                : job.status === 'completed'
                ? 'Completed'
                : 'Cancelled'}
            </Text>
          </View>
        </View>

        {/* Primary Job Overview Card */}
        <View style={styles.jobCard}>
          <View style={styles.categoryRow}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>🛠️ {job.categoryId.toUpperCase()}</Text>
            </View>
            <Text style={styles.postedTimeText}>Posted 3h ago</Text>
          </View>

          <Text style={styles.jobTitle}>{job.title}</Text>

          <View style={styles.budgetRow}>
            <Text style={styles.budgetLabel}>Client Budget:</Text>
            <Text style={styles.budgetValue}>{budgetText}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailsIcon}>📍</Text>
            <Text style={styles.detailsText}>{job.addressText}</Text>
          </View>

          <View style={styles.detailsRow}>
            <Text style={styles.detailsIcon}>📅</Text>
            <Text style={styles.detailsText}>Preferred Date: {job.preferredDate || 'Flexible'}</Text>
          </View>

          <View style={styles.descriptionBox}>
            <Text style={styles.descriptionLabel}>Description:</Text>
            <Text style={styles.descriptionText}>{job.description}</Text>
          </View>

          {/* Worksite Photos: Displayed only if photos were actually attached by the client */}
          {job.photos && job.photos.length > 0 && (
            <View style={styles.photosSection}>
              <Text style={styles.photosLabel}>
                Attached Worksite Photos ({job.photos.length}):
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photoThumbnailsRow}
              >
                {job.photos.map((photoUrl, idx) => (
                  <View key={idx} style={styles.photoThumbnailCard}>
                    <Image
                      source={{ uri: photoUrl }}
                      style={styles.photoThumbnailImage}
                      resizeMode="cover"
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        {/* Owner Job Management Actions: Allows owner to permanently remove their job post */}
        {isOwner && (job.status === 'open' || job.status === 'cancelled') && (
          <View style={styles.ownerActionsCard}>
            <Pressable
              accessibilityRole="button"
              onPress={() => void handleDeleteJob()}
              style={({ pressed }) => [styles.deleteJobButton, pressed && { opacity: 0.8 }]}
              disabled={busy}
            >
              <Text style={styles.deleteJobButtonText}>🗑 Remove Job Post</Text>
            </Pressable>
          </View>
        )}

        {/* Post-Assignment Contact & Active Chat Section */}
        {job.status !== 'open' && job.status !== 'cancelled' && (
          <View style={styles.assignedSectionCard}>
            <Text style={styles.sectionHeading}>Assigned Professional</Text>
            <View style={styles.participantRow}>
              <View style={styles.participantAvatar}>
                <Text style={styles.avatarLetter}>
                  {(assignedWorkerName || 'Sunil').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.participantName}>{assignedWorkerName || 'Sunil Perera'}</Text>
                <Text style={styles.participantSub}>Verified Master Plumber • 4.9 ★</Text>
                <Text style={styles.agreedPriceTag}>
                  Agreed Rate: LKR {(job.acceptedPriceLkr || 14500).toLocaleString()}
                </Text>
              </View>
            </View>

            {/* Quick Actions: Call & Open Chat */}
            <View style={styles.actionButtonGroup}>
              <Pressable
                accessibilityRole="button"
                onPress={() => Linking.openURL(`tel:${assignedWorkerPhone || '+94779876543'}`)}
                style={styles.callButton}
              >
                <Text style={styles.callButtonText}>📞 Call Sunil</Text>
              </Pressable>

              <Pressable
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/chat/[id]', params: { id: job.id } })}
                style={styles.chatButton}
              >
                <Text style={styles.chatButtonText}>💬 Open Job Chat</Text>
              </Pressable>
            </View>

            {/* Lifecycle Progression Action Stepper */}
            <View style={styles.lifecycleBar}>
              {job.status === 'assigned' && (
                <Pressable onPress={() => void startWork()} style={styles.statusActionBtn}>
                  <Text style={styles.statusActionBtnText}>▶ Mark Work In-Progress</Text>
                </Pressable>
              )}
              {job.status === 'in_progress' && (
                <Pressable onPress={() => void confirmCompletion()} style={styles.statusActionBtn}>
                  <Text style={styles.statusActionBtnText}>✓ Confirm Job Completed</Text>
                </Pressable>
              )}
              {job.status === 'completed' && (
                <Pressable onPress={() => setReviewModalVisible(true)} style={styles.reviewCTAButton}>
                  <Text style={styles.reviewCTAButtonText}>★ Leave a Verified Review</Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* Stacked Quotes Received Section (For Open Jobs) */}
        {job.status === 'open' && (
          <View style={styles.quotesSection}>
            <View style={styles.quotesHeaderRow}>
              <Text style={styles.sectionHeading}>
                Quotes Received ({applications.length})
              </Text>
              <Text style={styles.sortPill}>Lowest Price First</Text>
            </View>

            {applications.length === 0 ? (
              <View style={styles.emptyQuotesCard}>
                <Text style={styles.emptyQuotesIcon}>⏳</Text>
                <Text style={styles.emptyQuotesText}>
                  Waiting for quotes. Nearby verified {job.categoryId.toLowerCase()} tradespeople in your area are reviewing your request.
                </Text>
              </View>
            ) : (
              applications.map((quote, idx) => {
                const isRecommended = idx === 0;
                return (
                  <View
                    key={quote.workerId}
                    style={[styles.quoteCard, isRecommended && styles.recommendedQuoteCard]}
                  >
                    {isRecommended && (
                      <View style={styles.recommendedBadge}>
                        <Text style={styles.recommendedBadgeText}>⚡ Best Value • Recommended</Text>
                      </View>
                    )}

                    <View style={styles.quoteTopRow}>
                      <View style={styles.quoteAvatar}>
                        <Text style={styles.quoteAvatarLetter}>
                          {(quote.workerName || 'S').charAt(0).toUpperCase()}
                        </Text>
                      </View>

                      <View style={styles.quoteWorkerInfo}>
                        <Text style={styles.quoteWorkerName}>{quote.workerName || 'Sunil Perera'}</Text>
                        <View style={styles.quoteMetaRow}>
                          <Text style={styles.quoteRating}>★ {quote.ratingAvg || 4.9} ({quote.ratingCount || 128})</Text>
                          <Text style={styles.metaDot}>•</Text>
                          <Text style={styles.quoteDistance}>📍 {quote.distanceKm || 2.4} km away</Text>
                        </View>
                      </View>

                      <View style={styles.quotePriceBox}>
                        <Text style={styles.quotePriceAmount}>
                          LKR {quote.quotedPriceLkr.toLocaleString()}
                        </Text>
                        <Text style={styles.quotePriceUnit}>total</Text>
                      </View>
                    </View>

                    {/* Pitch Message */}
                    <View style={styles.pitchMessageBox}>
                      <Text style={styles.pitchMessageText}>"{quote.message}"</Text>
                    </View>

                    {/* Action: Accept Quote & Hire */}
                    {isClient && (
                      <Pressable
                        accessibilityRole="button"
                        onPress={() => { void acceptQuote(quote); }}
                        disabled={busy}
                        style={({ pressed }) => [
                          styles.hireButton,
                          isRecommended ? styles.hireButtonPrimary : styles.hireButtonSecondary,
                          pressed && { opacity: 0.85 },
                        ]}
                      >
                        {busy ? (
                          <ActivityIndicator color="#ffffff" />
                        ) : (
                          <>
                            <Text
                              style={[
                                styles.hireButtonText,
                                !isRecommended && styles.hireButtonSecondaryText,
                              ]}
                            >
                              Accept Quote &amp; Hire {quote.workerName?.split(' ')[0] || 'Tradesperson'}
                            </Text>
                            <Image source={arrow} style={styles.arrowIcon} />
                          </>
                        )}
                      </Pressable>
                    )}
                  </View>
                );
              })
            )}

            {/* Worker Apply Button (If signed in as worker) */}
            {!isClient && (
              <Pressable
                onPress={() => setApplyModalVisible(true)}
                style={styles.workerApplyBtn}
              >
                <Text style={styles.workerApplyBtnText}>📝 Submit Your Quote for this Job</Text>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>

      {/* Apply with Quote Modal */}
      <ApplyModal
        visible={applyModalVisible}
        job={job}
        onClose={() => setApplyModalVisible(false)}
        onSuccess={() => void fetchJobAndQuotes()}
      />

      {/* Review counterparty modal upon job completion */}
      <ReviewModal
        visible={reviewModalVisible}
        jobId={job.id}
        rateeId={job.assignedWorkerId || 'worker-colombo-plumber-1'}
        rateeName={assignedWorkerName || 'Sunil Perera'}
        onClose={() => setReviewModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    backgroundColor: '#ffffff',
  },
  loadingText: {
    color: palette.muted,
    fontSize: 14,
    marginTop: 12,
    fontFamily: 'Plus Jakarta Sans',
  },
  errorText: {
    color: palette.danger,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Plus Jakarta Sans',
  },
  backPill: {
    backgroundColor: '#e6f1ec',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
  },
  backPillText: {
    color: palette.primary,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    marginBottom: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eaf4f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 22,
    color: palette.primary,
    fontWeight: '700',
  },
  screenTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 17,
    fontWeight: '800',
    color: palette.heading,
  },
  statusPill: {
    backgroundColor: '#e6f7ef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#c6e7d9',
  },
  statusPillText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    color: '#055b49',
  },
  jobCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e2ece7',
    marginBottom: 16,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 14,
    elevation: 2,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: '#f2f8f5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dcece4',
  },
  categoryBadgeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '800',
    color: palette.primary,
  },
  postedTimeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: palette.muted,
  },
  jobTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '800',
    color: palette.heading,
    lineHeight: 28,
    marginBottom: 12,
  },
  budgetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#d2e5dc',
    gap: 8,
  },
  budgetLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: palette.muted,
  },
  budgetValue: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '800',
    color: palette.primary,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  detailsIcon: {
    fontSize: 14,
  },
  detailsText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: '#344454',
  },
  descriptionBox: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f5f2',
    gap: 4,
  },
  descriptionLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    color: palette.heading,
  },
  descriptionText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: '#344454',
    lineHeight: 20,
  },
  photosSection: {
    marginTop: 14,
    gap: 8,
  },
  photosLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    color: palette.heading,
  },
  photoThumbnailsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  photoThumbnailCard: {
    width: 140,
    height: 100,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f4f4f5',
    borderWidth: 1,
    borderColor: '#dcece4',
  },
  photoThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  photoBox: {
    flex: 1,
    backgroundColor: '#f8faf9',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2ece7',
    borderStyle: 'dashed',
  },
  photoIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  photoCaption: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: palette.muted,
    textAlign: 'center',
  },
  assignedSectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#bbf0d8',
    marginBottom: 16,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  sectionHeading: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
    color: palette.heading,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 12,
    marginBottom: 14,
  },
  participantAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#e6f1ec',
    borderWidth: 1.5,
    borderColor: '#c6e0d3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '800',
    color: palette.primary,
    fontFamily: 'Plus Jakarta Sans',
  },
  participantName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
    color: palette.heading,
  },
  participantSub: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: palette.muted,
    marginTop: 2,
  },
  agreedPriceTag: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
    marginTop: 4,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  callButton: {
    flex: 1,
    backgroundColor: '#eaf4f0',
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cde4d9',
  },
  callButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
  },
  chatButton: {
    flex: 1,
    backgroundColor: palette.primary,
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
  },
  chatButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  lifecycleBar: {
    borderTopWidth: 1,
    borderTopColor: '#f0f5f2',
    paddingTop: 12,
  },
  statusActionBtn: {
    backgroundColor: '#055b49',
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statusActionBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  reviewCTAButton: {
    backgroundColor: '#f59e0b',
    borderRadius: 100,
    paddingVertical: 12,
    alignItems: 'center',
  },
  reviewCTAButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  quotesSection: {
    gap: 12,
  },
  quotesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sortPill: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    color: palette.muted,
    backgroundColor: '#f0f5f2',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  emptyQuotesCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2ece7',
    gap: 8,
  },
  emptyQuotesIcon: {
    fontSize: 28,
  },
  emptyQuotesText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: palette.muted,
    textAlign: 'center',
    lineHeight: 19,
  },
  quoteCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#e2ece7',
    marginBottom: 12,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  recommendedQuoteCard: {
    borderColor: '#055b49',
    backgroundColor: '#fbfffd',
  },
  recommendedBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#e6f7ef',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
  },
  recommendedBadgeText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    fontWeight: '800',
    color: '#055b49',
  },
  quoteTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  quoteAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6f1ec',
    borderWidth: 1,
    borderColor: '#c6dfd4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteAvatarLetter: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 18,
    fontWeight: '800',
    color: palette.primary,
  },
  quoteWorkerInfo: {
    flex: 1,
    gap: 2,
  },
  quoteWorkerName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '800',
    color: palette.heading,
  },
  quoteMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  quoteRating: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    color: '#f59e0b',
  },
  metaDot: {
    fontSize: 10,
    color: '#8aa096',
  },
  quoteDistance: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: palette.muted,
  },
  quotePriceBox: {
    alignItems: 'flex-end',
  },
  quotePriceAmount: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 16,
    fontWeight: '800',
    color: palette.primary,
  },
  quotePriceUnit: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    color: palette.muted,
  },
  pitchMessageBox: {
    backgroundColor: '#f8faf9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8f0ec',
  },
  pitchMessageText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: '#344454',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  hireButton: {
    height: 46,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hireButtonPrimary: {
    backgroundColor: palette.primary,
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 2,
  },
  hireButtonSecondary: {
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: palette.primary,
  },
  hireButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: '#ffffff',
  },
  hireButtonSecondaryText: {
    color: palette.primary,
  },
  arrowIcon: {
    width: 16,
    height: 16,
    marginLeft: 6,
    resizeMode: 'contain',
  },
  workerApplyBtn: {
    backgroundColor: '#eaf4f0',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#cde4d9',
    marginTop: 8,
  },
  workerApplyBtnText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.primary,
  },
  ownerActionsCard: {
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  deleteJobButton: {
    backgroundColor: '#FEE2E2',
    borderWidth: 1.5,
    borderColor: '#F87171',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteJobButtonText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
});
