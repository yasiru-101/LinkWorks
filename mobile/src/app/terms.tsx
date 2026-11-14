import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, spacing } from '../../../Bhashitha/Design/theme';

// Terms & Conditions and Safety Policy for LinkWorks marketplace participants.
export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header bar with Back button and screen title */}
      <View style={styles.header}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Terms &amp; Safety</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.docTitle}>LinkWorks Marketplace Terms</Text>
        <Text style={styles.lastUpdated}>Version 1.0.0 • Effective November 2026</Text>

        {/* Section 1: Introduction */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>1. Purpose &amp; Scope</Text>
          <Text style={styles.paragraph}>
            LinkWorks is an on-demand skilled labor marketplace operating across Sri Lanka (Colombo, Moratuwa, Kandy, Galle, Gampaha, and Negombo). We connect clients seeking trade services (plumbing, carpentry, electrical, masonry, painting, AC repair) with verified independent tradespeople.
          </Text>
        </View>

        {/* Section 2: Privacy & Phone Masking */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>2. Privacy &amp; Contact Masking</Text>
          <Text style={styles.paragraph}>
            To protect user privacy and prevent off-platform harassment, direct phone numbers are strictly concealed during the public search and job application phases. Counterparty phone numbers are revealed exclusively after a client officially assigns a worker to a job.
          </Text>
        </View>

        {/* Section 3: Quoting & Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>3. Quotes &amp; Agreed Pricing</Text>
          <Text style={styles.paragraph}>
            Workers submit bids containing an integer Sri Lankan Rupee (LKR) estimate and a scope pitch. Once a client accepts a quote, the accepted price becomes the agreed standard for that job. LinkWorks does not charge processing commissions or hold customer escrow funds in this demonstration release.
          </Text>
        </View>

        {/* Section 4: Verified Reviews & Reputation */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>4. Verified Reviews &amp; Trust</Text>
          <Text style={styles.paragraph}>
            Customer reviews can only be submitted against completed jobs by verified participants. One review per direction is permitted per job. Worker average star ratings and job completion counts are recalculated by trusted server logic and cannot be modified directly by client applications.
          </Text>
        </View>

        {/* Section 5: Trust, Safety & Moderation */}
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>5. Zero-Tolerance Safety Policy</Text>
          <Text style={styles.paragraph}>
            We maintain zero tolerance for abusive conduct, harassment, discriminatory language, fraudulent price escalation, or no-shows. Any party can submit an incident report via the Moderation system, resulting in immediate review and potential account suspension.
          </Text>
        </View>

        {/* Footer acknowledgment */}
        <View style={styles.footerCard}>
          <Text style={styles.footerText}>
            By signing in to LinkWorks, you agree to these operating standards and our commitment to a fair, respectful Sri Lankan trade marketplace.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.border,
  },
  backButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
  },
  backText: {
    color: palette.brand,
    fontSize: 16,
    fontWeight: '700',
  },
  headerTitle: {
    color: palette.heading,
    fontSize: 17,
    fontWeight: '700',
  },
  placeholder: {
    width: 48,
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  docTitle: {
    color: palette.heading,
    fontSize: 24,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  lastUpdated: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  section: {
    gap: spacing.xs,
  },
  sectionHeading: {
    color: palette.heading,
    fontSize: 17,
    fontWeight: '700',
  },
  paragraph: {
    color: palette.body,
    fontSize: 15,
    lineHeight: 22,
  },
  footerCard: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  footerText: {
    color: '#166534',
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
});
