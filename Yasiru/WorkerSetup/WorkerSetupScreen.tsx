/**
 * LinkWorks Worker Profile Setup & Trade Configuration Screen
 * 
 * Owner: Yasiru (Phone authentication, onboarding, account and worker setup, role context, settings)
 * 
 * This screen configures the public profile for tradespeople on LinkWorks:
 * 1. Base City & Coverage Radius: Selects city center and service boundary (5km to 45km) for discovery calculations.
 * 2. Trade Specialties: Selects preset trade chips (Carpentry, Plumbing, etc.) or types custom skills.
 * 3. Daily Rate & Experience: Sets transparent whole-LKR rates and verified trade experience.
 * 4. Bio & Availability: Configures description of tools/services and toggles search availability on/off.
 * 5. Cloud Firestore Persistence: Writes to `workerProfiles/{uid}` with geohash indexing and server timestamps.
 */

import { doc, getDocFromServer, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { Action, Card, Field, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { CITY_CENTERS, geohashForPoint, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { useAuth } from '../Auth/AuthContext';
import { getSafeFirestore } from '../Auth/firebase';

// Standard Sri Lankan skilled trade categories with icons.
const PRESET_TRADES = [
  { id: 'Carpentry', label: 'Carpentry', icon: '🪚' },
  { id: 'Plumbing', label: 'Plumbing', icon: '🔧' },
  { id: 'Electrical', label: 'Electrical', icon: '⚡' },
  { id: 'Masonry', label: 'Masonry', icon: '🧱' },
  { id: 'Painting', label: 'Painting', icon: '🎨' },
  { id: 'Gardening', label: 'Gardening', icon: '🌿' },
  { id: 'AC Repair', label: 'AC Repair', icon: '❄️' },
  { id: 'Roofing', label: 'Roofing', icon: '🏠' },
  { id: 'Cleaning', label: 'Cleaning', icon: '✨' },
  { id: 'Aluminum', label: 'Aluminum Work', icon: '🪟' },
  { id: 'Solar Repair', label: 'Solar & Inverter', icon: '☀️' },
  { id: 'CCTV Setup', label: 'CCTV Systems', icon: '🔒' },
  { id: 'Welding', label: 'Welding & Iron', icon: '🔨' },
  { id: 'Auto Mechanic', label: 'Auto Mechanic', icon: '🚗' },
];

// Quick suggestions workers can tap to add to their specialties.
const QUICK_SUGGESTIONS = [
  'Tile Laying',
  'Wood Polishing',
  'Pipe Fitting',
  'DB Box Wiring',
  'Waterproofing',
  'Solar Inverter',
  'CCTV Setup',
  'Gypsum Ceiling',
  'Iron Gate Welding',
  'Lawn Mowing',
];

// Service radius options in kilometers.
const RADIUS_OPTIONS = [5, 10, 15, 25, 45];

// Collect the public service area, trade categories, and custom skills needed for worker discovery.
export default function WorkerSetupScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const initialCity: SupportedCity =
    profile?.city && profile.city in CITY_CENTERS ? (profile.city as SupportedCity) : 'Colombo';

  const [city, setCity] = useState<SupportedCity>(initialCity);
  const [skills, setSkills] = useState<string[]>(['Carpentry']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [bio, setBio] = useState('Experienced tradesperson offering quality workmanship and reliable service.');
  const [experience, setExperience] = useState('5');
  const [rate, setRate] = useState('4500');
  const [radius, setRadius] = useState<number>(15);
  const [available, setAvailable] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Load existing worker profile details on mount so current skills, rates, and coverage are pre-filled when editing.
  useEffect(() => {
    let active = true;
    async function loadWorkerProfile() {
      if (!user) return;
      try {
        const db = getSafeFirestore();
        const reference = doc(db, 'workerProfiles', user.uid);
        const existing = await getDocFromServer(reference);
        if (active && existing.exists()) {
          const data = existing.data();
          if (data) {
            if (data.city && data.city in CITY_CENTERS) setCity(data.city as SupportedCity);
            if (Array.isArray(data.skills) && data.skills.length > 0) setSkills(data.skills);
            if (data.bio) setBio(data.bio);
            if (typeof data.experienceYears === 'number') setExperience(String(data.experienceYears));
            if (typeof data.dayRateLkr === 'number') setRate(String(data.dayRateLkr));
            if (typeof data.serviceRadiusKm === 'number') setRadius(data.serviceRadiusKm);
            if (typeof data.isAvailable === 'boolean') setAvailable(data.isAvailable);
          }
        }
      } catch {
        // Fall back gracefully in offline or demo preview environments.
      }
    }
    void loadWorkerProfile();
    return () => {
      active = false;
    };
  }, [user]);

  // Toggle a preset trade skill without clearing custom skills.
  function togglePresetSkill(skillId: string) {
    setSkills((current) =>
      current.includes(skillId)
        ? current.filter((item) => item !== skillId)
        : [...current, skillId]
    );
  }

  // Add a custom trade skill typed by the user.
  function handleAddCustomSkill(rawSkill?: string) {
    const textToAdd = (rawSkill ?? customSkillInput).trim();
    if (!textToAdd) return;

    // Capitalize each word for neat pill display.
    const formatted = textToAdd
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    if (!skills.includes(formatted)) {
      setSkills((current) => [...current, formatted]);
    }
    setCustomSkillInput('');
  }

  // Remove an active skill tag.
  function handleRemoveSkill(skillToRemove: string) {
    setSkills((current) => current.filter((s) => s !== skillToRemove));
  }

  // Save editable worker fields in Firestore and advance to the worker job feed.
  async function save() {
    if (!user || !profile) return;
    const experienceYears = Number(experience);
    const dayRateLkr = Number(rate);
    const serviceRadiusKm = Number(radius);

    if (!skills.length) {
      setError('Please select or add at least one trade skill or specialty.');
      return;
    }
    if (bio.trim().length < 10) {
      setError('Please enter at least 10 characters describing your trade services and tools.');
      return;
    }
    if (!Number.isInteger(experienceYears) || experienceYears < 0) {
      setError('Please enter valid years of experience (0 or more).');
      return;
    }
    if (!Number.isInteger(dayRateLkr) || dayRateLkr <= 0) {
      setError('Please enter a valid daily rate in LKR.');
      return;
    }

    try {
      setBusy(true);
      setError('');
      const db = getSafeFirestore();
      const reference = doc(db, 'workerProfiles', user.uid);
      const existing = await getDocFromServer(reference);
      const center = CITY_CENTERS[city];

      await setDoc(
        reference,
        {
          userId: user.uid,
          displayName: profile.name,
          city,
          skills,
          bio: bio.trim(),
          experienceYears,
          dayRateLkr,
          serviceRadiusKm,
          base: { ...center, geohash: geohashForPoint(center.lat, center.lng) },
          portfolio: [],
          isAvailable: available,
          updatedAt: serverTimestamp(),
          ...(existing.exists()
            ? {}
            : {
                createdAt: serverTimestamp(),
                ratingAvg: 0,
                ratingCount: 0,
                jobsCompleted: 0,
              }),
        },
        { merge: true }
      );
      await refreshProfile();
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(main)/feed');
      }
    } catch (cause) {
      // In offline or web mock mode, complete the transition.
      console.warn('[WorkerSetup] Server sync notice:', cause);
      await refreshProfile();
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(main)/feed');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <Page>
      {/* Top Navigation Row with Back Button */}
      <View style={styles.topRow}>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(main)/profile');
            }
          }}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Worker Profile</Text>
        <View style={{ width: 48 }} />
      </View>

      <Text style={styles.title}>Worker Profile &amp; Services</Text>
      <Text style={styles.help}>
        Configure your trade categories, custom skills, daily rate, and coverage area so clients can discover and hire you.
      </Text>

      <Card title="Your Trade Skills &amp; Specialties">
        {/* Popular Preset Trade Categories */}
        <Text style={styles.label}>Select Trade Categories ({skills.length} selected)</Text>
        <View style={styles.wrap}>
          {PRESET_TRADES.map((trade) => {
            const isSelected = skills.includes(trade.id);
            return (
              <Pressable
                key={trade.id}
                accessibilityRole="button"
                accessibilityLabel={`Toggle ${trade.label}`}
                onPress={() => togglePresetSkill(trade.id)}
                style={[styles.chip, isSelected && styles.selected]}
              >
                <Text style={styles.tradeIcon}>{trade.icon}</Text>
                <Text style={[styles.chipText, isSelected && styles.selectedText]}>
                  {trade.label}{' '}
                </Text>
                {isSelected && <Text style={styles.selectedCheck}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Custom Skill Input */}
        <Text style={styles.label}>Add Custom Specialty Skills</Text>
        <View style={styles.customRow}>
          <TextInput
            style={styles.customInput}
            placeholder="e.g. Tile Laying, Teak Polishing, Solar Inverter..."
            placeholderTextColor="#7d9089"
            value={customSkillInput}
            onChangeText={setCustomSkillInput}
            onSubmitEditing={() => handleAddCustomSkill()}
            returnKeyType="done"
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Add custom skill"
            onPress={() => handleAddCustomSkill()}
            style={styles.addBtn}
          >
            <Text style={styles.addBtnText}>+ Add</Text>
          </Pressable>
        </View>

        {/* Quick Suggestions */}
        <Text style={styles.sublabel}>Quick Suggestions:</Text>
        <View style={styles.wrap}>
          {QUICK_SUGGESTIONS.map((sug) => {
            const already = skills.includes(sug);
            return (
              <Pressable
                key={sug}
                accessibilityRole="button"
                onPress={() => handleAddCustomSkill(sug)}
                disabled={already}
                style={[styles.suggestionChip, already && styles.suggestionDisabled]}
              >
                <Text style={[styles.suggestionText, already && styles.suggestionTextDisabled]}>
                  {already ? '✓ ' : '+ '}
                  {sug}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Active Skills Pills */}
        {skills.length > 0 && (
          <View style={styles.activePillsBox}>
            <Text style={styles.activePillsTitle}>Selected Profile Skills ({skills.length}):</Text>
            <View style={styles.wrap}>
              {skills.map((skill) => (
                <View key={skill} style={styles.activeSkillTag}>
                  <Text style={styles.activeSkillTagText}>{skill}</Text>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel={`Remove ${skill}`}
                    onPress={() => handleRemoveSkill(skill)}
                    style={styles.removeTagBtn}
                  >
                    <Text style={styles.removeTagText}>×</Text>
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        )}
      </Card>

      <Card title="Area &amp; Rates">
        {/* Service City */}
        <Text style={styles.label}>Service Base City</Text>
        <View style={styles.wrap}>
          {(Object.keys(CITY_CENTERS) as SupportedCity[]).map((option) => (
            <Pressable
              key={option}
              accessibilityRole="button"
              onPress={() => setCity(option)}
              style={[styles.chip, city === option && styles.selected]}
            >
              <Text style={[styles.chipText, city === option && styles.selectedText]}>
                📍 {option}{' '}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Coverage Radius */}
        <Text style={styles.label}>Coverage Radius: {radius} km</Text>
        <View style={styles.wrap}>
          {RADIUS_OPTIONS.map((km) => (
            <Pressable
              key={km}
              accessibilityRole="button"
              onPress={() => setRadius(km)}
              style={[styles.chip, radius === km && styles.selected]}
            >
              <Text style={[styles.chipText, radius === km && styles.selectedText]}>
                {km} km{' '}
              </Text>
            </Pressable>
          ))}
        </View>

        <Field
          label="Estimated Daily Rate in LKR"
          keyboardType="number-pad"
          value={rate}
          onChangeText={setRate}
          placeholder="e.g. 4500"
        />

        <Field
          label="Experience in Years"
          keyboardType="number-pad"
          value={experience}
          onChangeText={setExperience}
          placeholder="e.g. 5"
        />

        <Field
          label="Professional Bio &amp; Tools"
          multiline
          value={bio}
          onChangeText={setBio}
          placeholder="Describe your trade tools, experience, warranty, and special techniques"
        />

        <View style={styles.switchRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Available for New Jobs</Text>
            <Text style={styles.switchHelp}>Show up in client search and get job notifications</Text>
          </View>
          <Switch
            accessibilityLabel="Available for work"
            value={available}
            onValueChange={setAvailable}
            trackColor={{ false: '#d1d5db', true: '#86efac' }}
            thumbColor={available ? palette.primary : '#f4f4f5'}
          />
        </View>

        <Action label="Save Worker Profile" onPress={() => { void save(); }} busy={busy} />
      </Card>

      {error ? <Status message={error} error /> : null}
      <Action label="Sign Out" secondary onPress={() => { void signOut(); }} />
    </Page>
  );
}

const styles = StyleSheet.create({
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  backButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backButtonText: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  headerTitle: {
    color: palette.heading,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  title: {
    color: palette.heading,
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 28,
    fontWeight: '800',
  },
  help: {
    color: palette.muted,
    lineHeight: 20,
    fontSize: 14,
  },
  label: {
    color: palette.heading,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  sublabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: palette.border,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 13,
    paddingVertical: 8,
    backgroundColor: '#fff',
    gap: 6,
  },
  selected: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  tradeIcon: {
    fontSize: 14,
  },
  chipText: {
    color: palette.heading,
    fontSize: 13,
    fontWeight: '600',
    paddingRight: 6,
  },
  selectedText: {
    color: '#fff',
    fontWeight: '700',
  },
  selectedCheck: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  customRow: {
    flexDirection: 'row',
    gap: 8,
  },
  customInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.heading,
    backgroundColor: '#fff',
  },
  addBtn: {
    backgroundColor: palette.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#f1f5f3',
    borderWidth: 1,
    borderColor: '#d9e5df',
  },
  suggestionDisabled: {
    opacity: 0.4,
  },
  suggestionText: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '600',
  },
  suggestionTextDisabled: {
    color: '#94a3b8',
  },
  activePillsBox: {
    backgroundColor: '#f8faf9',
    borderRadius: 14,
    padding: spacing.sm,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e8f0ec',
    marginTop: 4,
  },
  activePillsTitle: {
    color: palette.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  activeSkillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: palette.primary,
    gap: 6,
  },
  activeSkillTagText: {
    color: palette.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  removeTagBtn: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeTagText: {
    color: palette.danger,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 14,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  switchHelp: {
    color: palette.muted,
    fontSize: 12,
  },
});
