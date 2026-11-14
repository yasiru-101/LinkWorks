import { addDoc, collection, getFirestore, serverTimestamp } from '@react-native-firebase/firestore';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Action, Card, Field, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { CITY_CENTERS, findNearestSupportedCity, geohashForPoint, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { getCurrentDeviceLocation, isFusedLocationAvailable, requestLocationPermissions } from '../../Pasindu/Discovery/location-service';
import { useAuth } from '../../Yasiru/Auth/AuthContext';
import { validateOpenJob } from '../JobContracts/validation';

const CATEGORIES = [
  'Plumbing',
  'Carpentry',
  'Electrical',
  'Masonry',
  'Painting',
  'AC Repair',
  'Roofing',
  'Cleaning',
] as const;

// Screen for clients to post a new skilled-trade job with budget and live GPS or city location.
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

  // Live GPS state via Fused Location Provider
  const [useGpsCoords, setUseGpsCoords] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [locatingGps, setLocatingGps] = useState(false);

  // Acquire high-accuracy device coordinates via Fused Location Provider client
  async function detectGps() {
    try {
      setLocatingGps(true);
      setError('');

      if (!isFusedLocationAvailable()) {
        setError('Device GPS module not present in this APK build. Please select your city manually.');
        return;
      }

      const { status } = await requestLocationPermissions();
      if (status !== 'granted') {
        setError('Location permission denied. Please select a city manually.');
        return;
      }
      const pos = await getCurrentDeviceLocation(true);
      if (!pos) {
        setError('Could not detect device GPS coordinates. Please select city manually.');
        return;
      }
      const coords = { lat: pos.latitude, lng: pos.longitude };
      setGpsCoords(coords);
      setUseGpsCoords(true);

      const match = findNearestSupportedCity(coords);
      setCity(match.city);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not detect device GPS.');
    } finally {
      setLocatingGps(false);
    }
  }

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
      : `${city} area`;

    // Use live GPS coordinates if captured; otherwise fall back to selected city center
    const targetCoords = (useGpsCoords && gpsCoords) ? gpsCoords : CITY_CENTERS[city];
    const geo = {
      lat: targetCoords.lat,
      lng: targetCoords.lng,
      geohash: geohashForPoint(targetCoords.lat, targetCoords.lng),
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
        location: { lat: geo.lat, lng: geo.lng },
        city,
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
          placeholder="e.g. Repair leaking kitchen sink pipe"
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
                <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Field
          label="Description &amp; Requirements"
          placeholder="Describe the issue, required tools/materials, and job scope in detail…"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
      </Card>

      <Card title="Budget &amp; Schedule">
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
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

      <Card title="Job Location">
        {/* GPS Capture Button */}
        <Pressable
          accessibilityRole="button"
          onPress={() => { void detectGps(); }}
          style={[styles.gpsDetectButton, useGpsCoords && styles.gpsDetectButtonActive]}
        >
          <Text style={[styles.gpsDetectText, useGpsCoords && styles.gpsDetectTextActive]}>
            {locatingGps
              ? 'Acquiring GPS fix via Fused Location…'
              : useGpsCoords
              ? `✓ Pinned to Device GPS (${gpsCoords?.lat.toFixed(4)}, ${gpsCoords?.lng.toFixed(4)})`
              : '📍 Pin Job to Current Device GPS'}
          </Text>
        </Pressable>

        <Text style={styles.sectionLabel}>Service City</Text>
        <View style={styles.chipsWrap}>
          {(Object.keys(CITY_CENTERS) as SupportedCity[]).map((c) => {
            const isSelected = city === c;
            return (
              <Pressable
                key={c}
                accessibilityRole="button"
                onPress={() => {
                  setCity(c);
                  setUseGpsCoords(false);
                }}
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
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#f4f4f5',
    borderWidth: 1,
    borderColor: '#e4e4e7',
  },
  selectedChip: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  chipText: {
    fontSize: 13,
    color: palette.heading,
    fontWeight: '600',
  },
  selectedChipText: {
    color: '#ffffff',
  },
  gpsDetectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginBottom: spacing.sm,
  },
  gpsDetectButtonActive: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  gpsDetectText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#166534',
  },
  gpsDetectTextActive: {
    color: '#15803d',
  },
});
