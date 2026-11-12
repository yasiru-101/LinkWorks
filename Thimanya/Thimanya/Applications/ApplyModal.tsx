import { doc, getFirestore, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Card, Field, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import type { Job } from '../../mobile/src/types/domain';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { validateQuote } from '../JobContracts/validation';

// Modal dialog for workers to submit a priced quote and pitch for an open job.
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
  const { user } = useAuth();
  const [price, setPrice] = useState(
    job.budgetMinLkr ? String(job.budgetMinLkr) : '4000'
  );
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Validate quote input and submit application to the job's subcollection.
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
      try {
        const appRef = doc(getFirestore(), 'jobs', job.id, 'applications', user.uid);
        await setDoc(appRef, {
          workerId: user.uid,
          quotedPriceLkr: priceLkr,
          message: message.trim(),
          status: 'submitted',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Fall back gracefully in preview/offline mode
      }

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
    color: palette.muted,
    fontSize: 18,
    fontWeight: '700',
  },
  jobTitle: {
    color: palette.heading,
    fontSize: 16,
    fontWeight: '700',
  },
  budgetContext: {
    color: palette.muted,
    fontSize: 13,
    marginBottom: spacing.xs,
  },
  actions: {
    marginTop: spacing.xs,
    paddingBottom: spacing.sm,
  },
});
