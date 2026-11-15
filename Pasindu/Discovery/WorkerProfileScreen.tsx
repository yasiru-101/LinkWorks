import { collection, doc, getDocFromServer, getDocs, query, where } from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { ReportModal } from '../../Bhashitha/Moderation/ReportModal';
import { SEED_REVIEWS, SEED_WORKERS, type SeedReview } from '../../Bhashitha/Seed/seed-data';
import type { WorkerProfile } from '../../mobile/src/types/domain';
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';

const arrow = require('../../mobile/assets/images/login/arrow-right.png');

// Public worker profile screen matching the LinkWorks Figma/mockup specifications.
export default function WorkerProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [worker, setWorker] = useState<WorkerProfile | null>(null);
  const [reviews, setReviews] = useState<SeedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportModalVisible, setReportModalVisible] = useState(false);

  // Fetch the worker's public document and their verified customer reviews.
  useEffect(() => {
    async function fetchWorkerAndReviews() {
      if (!id) return;
      try {
        setLoading(true);
        setError('');

        // 1. Fetch worker profile from Firestore or fallback to demo seed
        let currentWorker: WorkerProfile | null = null;
        try {
          const db = getSafeFirestore();
          const snapshot = await getDocFromServer(doc(db, 'workerProfiles', id));
          if (snapshot.exists()) {
            currentWorker = snapshot.data() as WorkerProfile;
          }
        } catch {
          // Fall back gracefully in offline or preview mode
        }

        if (!currentWorker) {
          currentWorker = SEED_WORKERS.find((w) => w.userId === id) ?? null;
        }

        if (!currentWorker) {
          setError('Worker profile not found.');
          return;
        }
        setWorker(currentWorker);

        // 2. Fetch customer reviews for this worker
        let fetchedReviews: SeedReview[] = [];
        try {
          const revSnap = await getDocs(
            query(collection(getSafeFirestore(), 'reviews'), where('rateeId', '==', id))
          );
          if (!revSnap.empty) {
            fetchedReviews = revSnap.docs.map((d) => ({
              id: d.id,
              ...(d.data() as Omit<SeedReview, 'id'>),
            }));
          }
        } catch {
          // Fall back to seed reviews in demo
        }

        if (fetchedReviews.length === 0) {
          fetchedReviews = SEED_REVIEWS.filter((r) => r.rateeId === id);
        }
        setReviews(fetchedReviews);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error loading worker.');
      } finally {
        setLoading(false);
      }
    }
    void fetchWorkerAndReviews();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <ActivityIndicator size="large" color={palette.primary} />
        <Text style={styles.loadingText}>Loading worker profile…</Text>
      </SafeAreaView>
    );
  }

  if (error || !worker) {
    return (
      <SafeAreaView style={styles.centerContainer}>
        <Text style={styles.errorText}>{error || 'Worker not found'}</Text>
        <Pressable onPress={() => router.back()} style={styles.backPill}>
          <Text style={styles.backPillText}>← Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  const primarySkill = worker.skills[0] ?? 'Plumbing';
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.stars, 0) / reviews.length
      : worker.ratingAvg || 4.9;
  const reviewCount = reviews.length > 0 ? reviews.length : worker.ratingCount || 128;

  // Mock portfolio projects to showcase work quality
  const portfolioProjects = [
    { title: 'Full Bathroom Pipework', tag: 'Completed', icon: '🚿' },
    { title: 'Solar Water Pump Setup', tag: 'Installed', icon: '☀️' },
    { title: 'Pressure Leak Detection', tag: 'Repaired', icon: '🔧' },
  ];

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Navigation Row */}
        <View style={styles.topBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={() => router.back()}
            style={({ pressed }) => [styles.backButton, pressed && { opacity: 0.8 }]}
          >
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>

          <Text style={styles.screenTitle}>Worker Profile</Text>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Report profile"
            onPress={() => setReportModalVisible(true)}
            style={styles.reportIconBtn}
          >
            <Text style={styles.reportIconText}>⚠️</Text>
          </Pressable>
        </View>

        {/* Profile Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarLetter}>{worker.displayName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.onlineBadge} />
          </View>

          <View style={styles.heroNameRow}>
            <Text style={styles.heroName}>{worker.displayName}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedIcon}>✓</Text>
              <Text style={styles.verifiedText}>Verified Pro</Text>
            </View>
          </View>

          <Text style={styles.heroTrade}>
            Master {primarySkill} Specialist • {worker.city}, Sri Lanka
          </Text>

          <View style={styles.ratePill}>
            <Text style={styles.ratePillLabel}>Standard Rate:</Text>
            <Text style={styles.ratePillValue}>
              LKR {worker.dayRateLkr ? worker.dayRateLkr.toLocaleString() : '4,500'}
            </Text>
            <Text style={styles.ratePillUnit}>/ day</Text>
          </View>
        </View>

        {/* 4-Metric Performance Ribbon */}
        <View style={styles.metricsRibbon}>
          <View style={styles.metricItem}>
            <Text style={styles.metricPrimary}>
              ★ {averageRating.toFixed(1)}
            </Text>
            <Text style={styles.metricSecondary}>{reviewCount} Reviews</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricPrimary}>{worker.jobsCompleted || 85}</Text>
            <Text style={styles.metricSecondary}>Jobs Completed</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricPrimary}>98%</Text>
            <Text style={styles.metricSecondary}>On-Time</Text>
          </View>

          <View style={styles.metricDivider} />

          <View style={styles.metricItem}>
            <Text style={styles.metricPrimary}>&lt; 15m</Text>
            <Text style={styles.metricSecondary}>Response</Text>
          </View>
        </View>

        {/* About the Tradesperson */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeading}>About the Tradesperson</Text>
          <Text style={styles.bioBody}>{worker.bio}</Text>
          <View style={styles.experienceTag}>
            <Text style={styles.experienceText}>
              🏅 {worker.experienceYears}+ Years Trade Experience • {worker.serviceRadiusKm} km coverage around {worker.city}
            </Text>
          </View>
        </View>

        {/* Skills & Specialties */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeading}>Skills &amp; Capabilities</Text>
          <View style={styles.skillsWrap}>
            {worker.skills.map((skill) => (
              <View key={skill} style={styles.skillPill}>
                <Text style={styles.skillPillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Portfolio / Previous Work Showcase */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeading}>Recent Projects &amp; Portfolio</Text>
          <View style={styles.portfolioGrid}>
            {portfolioProjects.map((proj, idx) => (
              <View key={idx} style={styles.portfolioItem}>
                <View style={styles.portfolioIconBox}>
                  <Text style={styles.portfolioIcon}>{proj.icon}</Text>
                </View>
                <Text style={styles.portfolioTitle} numberOfLines={1}>
                  {proj.title}
                </Text>
                <Text style={styles.portfolioTag}>{proj.tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Customer Reviews Section */}
        <View style={styles.cardSection}>
          <View style={styles.reviewsHeaderRow}>
            <Text style={styles.sectionHeading}>Verified Client Reviews</Text>
            <Text style={styles.reviewsRatingOverall}>
              ★ {averageRating.toFixed(1)} / 5.0
            </Text>
          </View>

          {reviews.length === 0 ? (
            <Text style={styles.emptyReviews}>
              No reviews recorded yet. Verified client reviews appear here upon job completion.
            </Text>
          ) : (
            reviews.slice(0, 3).map((rev) => (
              <View key={rev.id} style={styles.reviewItem}>
                <View style={styles.reviewHeaderRow}>
                  <Text style={styles.raterName}>{rev.raterName}</Text>
                  <Text style={styles.reviewStars}>
                    {'★'.repeat(rev.stars)}{'☆'.repeat(5 - rev.stars)}
                  </Text>
                </View>
                <Text style={styles.reviewBody}>{rev.text}</Text>
                <Text style={styles.reviewDate}>Verified client • {rev.createdAt}</Text>
              </View>
            ))
          )}
        </View>

        {/* Privacy Note */}
        <View style={styles.privacyNotice}>
          <Text style={styles.privacyShieldIcon}>🛡️</Text>
          <Text style={styles.privacyNoticeText}>
            Direct phone calling and chat become available as soon as this tradesperson is assigned to your job.
          </Text>
        </View>

        {/* Bottom Primary Action: Request a Quote */}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Request quote from ${worker.displayName}`}
          onPress={() =>
            router.push({
              pathname: '/post-job',
              params: {
                prefillCategory: primarySkill,
                workerName: worker.displayName,
              },
            })
          }
          style={({ pressed }) => [styles.primaryCTA, pressed && styles.pressed]}
        >
          <Text style={styles.primaryCTAText}>Request a Quote</Text>
          <Image source={arrow} style={styles.arrowIcon} />
        </Pressable>

        {/* Report Link */}
        <Pressable onPress={() => setReportModalVisible(true)} style={styles.reportRow}>
          <Text style={styles.reportRowText}>Report profile or policy concern</Text>
        </Pressable>
      </ScrollView>

      {/* Moderation / Report Dialog */}
      <ReportModal
        visible={reportModalVisible}
        targetId={worker.userId}
        targetType="user"
        targetTitle={worker.displayName}
        onClose={() => setReportModalVisible(false)}
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
  reportIconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8faf9',
    borderWidth: 1,
    borderColor: '#e2ece7',
  },
  reportIconText: {
    fontSize: 16,
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2ece7',
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 3,
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 14,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e6f1ec',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#c6e0d3',
  },
  avatarLetter: {
    fontSize: 34,
    fontWeight: '800',
    color: palette.primary,
    fontFamily: 'Plus Jakarta Sans',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  heroNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  heroName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 22,
    fontWeight: '800',
    color: palette.heading,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f7ef',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 3,
    gap: 4,
  },
  verifiedIcon: {
    color: '#055b49',
    fontSize: 11,
    fontWeight: '800',
  },
  verifiedText: {
    color: '#055b49',
    fontSize: 11,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  heroTrade: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: palette.muted,
    marginBottom: 16,
  },
  ratePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#cde4d9',
    gap: 6,
  },
  ratePillLabel: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: palette.muted,
  },
  ratePillValue: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '800',
    color: palette.primary,
  },
  ratePillUnit: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: palette.muted,
  },
  metricsRibbon: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e2ece7',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 1,
  },
  metricItem: {
    alignItems: 'center',
    flex: 1,
  },
  metricPrimary: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
    fontWeight: '800',
    color: palette.heading,
    marginBottom: 2,
  },
  metricSecondary: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 10,
    color: palette.muted,
    fontWeight: '600',
  },
  metricDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e6ece9',
  },
  cardSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2ece7',
    marginBottom: 16,
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  sectionHeading: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '800',
    color: palette.heading,
    marginBottom: 10,
  },
  bioBody: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    color: '#344454',
    lineHeight: 20,
    marginBottom: 12,
  },
  experienceTag: {
    backgroundColor: '#f8faf9',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e6eee9',
  },
  experienceText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '600',
    color: palette.primary,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillPill: {
    backgroundColor: '#f2f8f5',
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#cde4d9',
  },
  skillPillText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    fontWeight: '700',
    color: '#055b49',
  },
  portfolioGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  portfolioItem: {
    flex: 1,
    backgroundColor: '#f8faf9',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6eee9',
  },
  portfolioIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e2ece7',
  },
  portfolioIcon: {
    fontSize: 20,
  },
  portfolioTitle: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    fontWeight: '700',
    color: palette.heading,
    textAlign: 'center',
  },
  portfolioTag: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 9,
    color: palette.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  reviewsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewsRatingOverall: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '800',
    color: '#d97706',
  },
  emptyReviews: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: palette.muted,
    lineHeight: 18,
  },
  reviewItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f5f2',
    gap: 4,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  raterName: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 13,
    fontWeight: '700',
    color: palette.heading,
  },
  reviewStars: {
    color: '#f59e0b',
    fontSize: 12,
  },
  reviewBody: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: '#344454',
    lineHeight: 18,
  },
  reviewDate: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#8aa096',
  },
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f4',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#cde4d9',
    gap: 10,
    marginBottom: 20,
  },
  privacyShieldIcon: {
    fontSize: 18,
  },
  privacyNoticeText: {
    flex: 1,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 11,
    color: '#46685d',
    lineHeight: 16,
  },
  primaryCTA: {
    height: 52,
    borderRadius: 100,
    backgroundColor: palette.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 14,
  },
  primaryCTAText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 15,
    fontWeight: '700',
    color: '#ffffff',
  },
  arrowIcon: {
    width: 18,
    height: 18,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  reportRow: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  reportRowText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 12,
    color: palette.muted,
    textDecorationLine: 'underline',
  },
  pressed: {
    opacity: 0.85,
  },
});
