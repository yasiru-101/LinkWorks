import { addDoc, collection, getFirestore, serverTimestamp } from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Card, Field, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { CITY_CENTERS, geohashForPoint, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { validateOpenJob } from '../JobContracts/validation';

const CATEGORIES = [
  'Plumbing',
  'Carpentry',
  'Electrical',
  'Masonry',
  'Painting',
  'Gardening',
  'AC Repair',
  'Roofing',
] as const;

// Screen for clients to post a new skilled-trade job with budget and location.
export default function PostJobScreen() {
  const { user, profile } = useAuth();
  const params = useLocalSearchParams<{ prefillCategory?: string; workerName?: string }>();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(params.prefillCategory ?? 'Plumbing');
  const [description, setDescription] = useState(
    params.workerName ? `Requesting a quote from ${params.workerName}: ` : ''
  );
  const [budgetMin, setBudgetMin] = useState('3000');
  const [budgetMax, setBudgetMax] = useState('6000');
  const [city, setCity] = useState<SupportedCity>(
    profile?.city && profile.city in CITY_CENTERS ? (profile.city as SupportedCity) : 'Colombo'
  );
  const [addressDetails, setAddressDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('Within 3 days');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Validate form inputs and submit new open job document to Firestore.
  async function submitJob() {
    if (!user) {
      setError('Please sign in to post a job.');
      return;
    }

    const budgetMinLkr = parseInt(budgetMin, 10);
    const budgetMaxLkr = parseInt(budgetMax, 10);

    // Validate using shared business rules from JobContracts.
    const validationError = validateOpenJob({
      title,
      description,
      categoryId: category,
      budgetMinLkr: Number.isNaN(budgetMinLkr) ? undefined : budgetMinLkr,
      budgetMaxLkr: Number.isNaN(budgetMaxLkr) ? undefined : budgetMaxLkr,
    });

    if (validationError) {
      setError(validationError);
      return;
    }

    const addressText = addressDetails.trim()
      ? `${addressDetails.trim()}, ${city}`
      : `${city} city`;

    const cityCoords = CITY_CENTERS[city];
    const geo = {
      lat: cityCoords.lat,
      lng: cityCoords.lng,
      geohash: geohashForPoint(cityCoords.lat, cityCoords.lng),
    };

    try {
      setBusy(true);
      setError('');

      await addDoc(collection(getFirestore(), 'jobs'), {
        clientId: user.uid,
        title: title.trim(),
        description: description.trim(),
        categoryId: category,
        photos: [],
        budgetMinLkr,
        budgetMaxLkr,
        geo,
        addressText,
        preferredDate,
        status: 'open',
        applicationCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // Navigate to client jobs list after posting.
      router.replace('/(main)/jobs');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      <View style={styles.topRow}>
        <Pressable accessibilityRole="button" onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </Pressable>
        <Text style={styles.pageTitle}>Post a Job</Text>
        <View style={{ width: 48 }} />
      </View>

      <Card title="Job Details">
        <Field
          label="Job Title"
          placeholder="e.g. Repair leaking kitchen drain pipe"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.sectionLabel}>Trade Category</Text>
        <View style={styles.chipsWrap}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <Pressable
                key={cat}
                accessibilityRole="button"
                onPress={() => setCategory(cat)}
                style={[styles.chip, isSelected && styles.selectedChip]}
              >
                <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>{cat}</Text>
              </Pressable>
            );
          })}
        </View>

        <Field
          label="Detailed Description"
          multiline
          numberOfLines={4}
          placeholder="Describe the issue, work needed, and any materials on site…"
          value={description}
          onChangeText={setDescription}
        />
      </Card>

      <Card title="Budget & Timeline">
        <View style={styles.budgetRow}>
          <View style={{ flex: 1 }}>
            <Field
              label="Min Budget (LKR)"
              keyboardType="number-pad"
              value={budgetMin}
              onChangeText={setBudgetMin}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Field
              label="Max Budget (LKR)"
              keyboardType="number-pad"
              value={budgetMax}
              onChangeText={setBudgetMax}
            />
          </View>
        </View>

        <Field
          label="Preferred Timing / Date"
          placeholder="e.g. Urgently today, Tomorrow morning, or Within 3 days"
          value={preferredDate}
          onChangeText={setPreferredDate}
        />
      </Card>

      <Card title="Location">
        <Text style={styles.sectionLabel}>Service City</Text>
        <View style={styles.chipsWrap}>
          {(Object.keys(CITY_CENTERS) as SupportedCity[]).map((c) => {
            const isSelected = city === c;
            return (
              <Pressable
                key={c}
                accessibilityRole="button"
                onPress={() => setCity(c)}
                style={[styles.chip, isSelected && styles.selectedChip]}
              >
                <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>{c}</Text>
              </Pressable>
            );
          })}
        </View>

        <Field
          label="Street Address / Landmark"
          placeholder="e.g. No 42 Galle Road, Kollupitiya"
          value={addressDetails}
          onChangeText={setAddressDetails}
        />
      </Card>

      {error ? <Status message={error} error /> : null}

      <Action label="Publish Job" busy={busy} onPress={() => { void submitJob(); }} />
    </Page>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backText: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  pageTitle: {
    color: palette.heading,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  sectionLabel: {
    color: palette.heading,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: spacing.xs,
  },
  chip: {
    backgroundColor: palette.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: palette.border,
  },
  selectedChip: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  chipText: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#ffffff',
  },
  budgetRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
});
