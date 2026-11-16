/**
 * LinkWorks Worker Quote & Bid Submission Modal
 * 
 * Owner: Thimanya (Nearby job feed, job posting, applications, quotes, assignment, job lifecycle)
 * 
 * This modal allows tradespeople to submit a formal price bid and pitch on an open client job:
 * 1. Price Input: Validates positive integer whole-LKR quote (`quotedPriceLkr > 0`).
 * 2. Message / Pitch: Enforces meaningful pitch message (minimum 10 characters).
 * 3. Firestore Path: Writes directly to subcollection `jobs/{jobId}/applications/{workerId}` with status 'submitted'.
 * 4. Safety: Complies with Firestore rules requiring worker ownership and open job status.
 */

import { doc, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Card, Field, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import type { Job } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { getSafeFirestore } from '../../Yasiru/Auth/firebase';
import { validateQuote } from '../JobContracts/validation';
import { savePersistentApplication } from '../Jobs/job-storage';

// Modal dialog for workers to submit a priced quote and pitch for an open job directly to Cloud Firestore.
export function ApplyModal({
  visible,
  job,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  job: Job & { id: string };
  onClose: () => void;
  onSuccess?: () => void;
}) {
  const { user, profile } = useAuth();
  const [price, setPrice] = useState(
    job.budgetMinLkr ? String(job.budgetMinLkr) : '4000'
  );
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Validate quote input and submit application directly to Firestore subcollection.
  async function submitQuote() {
    if (!user) {
      setError('Please sign in to submit a quote.');
      return;
    }
    if (job.clientId === user.uid) {
      setError('You cannot apply to your own posted job.');
      return;
    }

    const priceLkr = parseInt(price, 10);
    const validationError = validateQuote(priceLkr, message);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setBusy(true);
      setError('');

      // Write quote directly to Cloud Firestore subcollection jobs/{jobId}/applications/{workerId}
      const db = getSafeFirestore();
      const appRef = doc(db, 'jobs', job.id, 'applications', user.uid);
      await setDoc(appRef, {
        workerId: user.uid,
        quotedPriceLkr: priceLkr,
        message: message.trim(),
        status: 'submitted',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Persist quote to on-device flash storage for reliable local presentation
      await savePersistentApplication(job.id, {
        workerId: user.uid,
        quotedPriceLkr: priceLkr,
        message: message.trim(),
        status: 'submitted',
        createdAt: new Date().toISOString(),
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not submit quote.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.header}>
            <Text style={styles.title}>Submit Quote</Text>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <Text style={styles.jobTitle}>{job.title}</Text>
          <Text style={styles.budgetContext}>
            Client Budget: {job.budgetMinLkr && job.budgetMaxLkr
              ? `Rs. ${job.budgetMinLkr.toLocaleString()} – ${job.budgetMaxLkr.toLocaleString()}`
              : 'Negotiable'}
          </Text>

          <Card>
            <Field
              label="Your Quoted Price (LKR)"
              keyboardType="number-pad"
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 4500"
            />
            <Field
              label="Pitch / Message to Client"
              multiline
              numberOfLines={4}
              value={message}
              onChangeText={setMessage}
              placeholder="State when you can start, your experience with this work, and tools you will bring…"
            />
          </Card>

          {error ? <Status message={error} error /> : null}

          <View style={styles.actions}>
            <Action label="Send Quote to Client" busy={busy} onPress={() => { void submitQuote(); }} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: palette.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: spacing.lg,
    gap: spacing.sm,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: palette.heading,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  closeBtn: {
    padding: 6,
  },
  closeText: {
    fontFamily: 'Plus Jakarta Sans',
    color: palette.muted,
    fontSize: 18,
    fontWeight: '700',
  },
  jobTitle: {
    fontFamily: 'Plus Jakarta Sans',
    color: palette.heading,
    fontSize: 16,
    fontWeight: '700',
  },
  budgetContext: {
    fontFamily: 'Plus Jakarta Sans',
    color: palette.muted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  actions: {
    marginTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
});
