import { doc, getDocFromServer, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, spacing } from '../../Bhashitha/Design/theme';
import { CITY_CENTERS, geohashForPoint, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { useAuth } from './AuthContext';
import { getSafeFirestore } from './firebase';

// Popular trade categories for Sri Lankan home services and construction.
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

// Quick-add specialty tags workers can tap to add to their profile immediately.
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

type RoleChoice = 'client' | 'worker' | 'both';

// Profile Setup and Account Creation screen allowing users to choose Client, Worker, or Both,
// and allowing workers to select preset trades and add custom skills.
export default function ProfileSetupScreen() {
  const { user, profile, saveProfile, signOut } = useAuth();

  // Basic user identity state.
  const [name, setName] = useState(profile?.name ?? '');
  const [selectedCity, setSelectedCity] = useState<SupportedCity>('Colombo');

  // Role selection state with three clear options: Client, Worker, or Both.
  const initialRole: RoleChoice =
    profile?.isClient && profile?.isWorker
      ? 'both'
      : profile?.isWorker
      ? 'worker'
      : 'client';
  const [roleChoice, setRoleChoice] = useState<RoleChoice>(initialRole);

  // Worker-specific skills, rates, and experience state.
  const [skills, setSkills] = useState<string[]>(['Plumbing']);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [dailyRate, setDailyRate] = useState('4500');
  const [experienceYears, setExperienceYears] = useState('4');
  const [serviceRadius, setServiceRadius] = useState<number>(15);
  const [bio, setBio] = useState('');

  // Form submission and loading state.
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Toggle a preset trade skill chip on or off.
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

    // Capitalize first letter of each word for clean presentation.
    const formatted = textToAdd
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');

    if (!skills.includes(formatted)) {
      setSkills((current) => [...current, formatted]);
    }
    setCustomSkillInput('');
  }

  // Remove a selected skill pill.
  function handleRemoveSkill(skillToRemove: string) {
    setSkills((current) => current.filter((s) => s !== skillToRemove));
  }

  // Validate form inputs and persist the profile to Firestore / AuthContext.
  async function handleCompleteSetup() {
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter your full name to complete your profile.');
      return;
    }

    const isClient = roleChoice === 'client' || roleChoice === 'both';
    const isWorker = roleChoice === 'worker' || roleChoice === 'both';

    // If offering services, validate trade skills, rates, and experience.
    const numRate = Number(dailyRate);
    const numExp = Number(experienceYears);

    if (isWorker) {
      if (skills.length === 0) {
        setError('Please select or add at least one trade skill or specialty.');
        return;
      }
      if (!Number.isFinite(numRate) || numRate <= 0) {
        setError('Please enter a valid estimated daily rate in LKR.');
        return;
      }
      if (!Number.isFinite(numExp) || numExp < 0) {
        setError('Please enter your years of experience in the trade.');
        return;
      }
    }

    try {
      setBusy(true);
      setError('');

      // Persist the user profile through AuthContext.
      await saveProfile({
        name: cleanName,
        city: selectedCity,
        isClient,
        isWorker,
        skills: isWorker ? skills : undefined,
        dayRateLkr: isWorker ? numRate : undefined,
        experienceYears: isWorker ? numExp : undefined,
        serviceRadiusKm: isWorker ? serviceRadius : undefined,
        bio: isWorker ? bio.trim() : undefined,
      });

      // If user has a Firebase UID and is a worker, write to workerProfiles collection.
      if (user?.uid && isWorker) {
        try {
          const db = getSafeFirestore();
          const center = CITY_CENTERS[selectedCity];
          const workerRef = doc(db, 'workerProfiles', user.uid);
          const existing = await getDocFromServer(workerRef);
          await setDoc(
            workerRef,
            {
              userId: user.uid,
              displayName: cleanName,
              city: selectedCity,
              skills,
              bio: bio.trim() || `Experienced tradesperson serving ${selectedCity} and nearby areas.`,
              experienceYears: numExp,
              dayRateLkr: numRate,
              serviceRadiusKm: serviceRadius,
              base: { ...center, geohash: geohashForPoint(center.lat, center.lng) },
              portfolio: [],
              isAvailable: true,
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
        } catch (dbErr) {
          // In offline or web preview environments, local state handles navigation gracefully.
          console.warn('[ProfileSetup] Worker profile direct sync skipped:', dbErr);
        }
      }

      // Navigate to the appropriate initial screen based on selected role.
      if (roleChoice === 'worker') {
        router.replace('/(main)/feed');
      } else {
        router.replace('/(main)/home');
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  // Display the user's initial for the profile avatar placeholder.
  const displayInitial = name.trim() ? name.trim().charAt(0).toUpperCase() : 'U';

  const isWorkerSelected = roleChoice === 'worker' || roleChoice === 'both';

  return (
    <SafeAreaView style={styles.safeArea} edges={Platform.OS === 'web' ? [] : ['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Brand Section */}
          <View style={styles.header}>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Step 2 of 2</Text>
              </View>
              <Text style={styles.brandTitle}>
                <Text style={styles.brandLink}>Link</Text>
                <Text style={styles.brandWorks}>Works</Text>
              </Text>
            </View>
            <Text style={styles.mainTitle}>Create Your Account</Text>
            <Text style={styles.subtitle}>
              Choose how you want to use LinkWorks and set up your profile details.
            </Text>
          </View>

          {/* Avatar and Basic Details Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Personal Details</Text>

            {/* Avatar Placeholder with Initial */}
            <View style={styles.avatarRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{displayInitial}</Text>
                <View style={styles.avatarCameraBadge}>
                  <Text style={styles.cameraIcon}>📷</Text>
                </View>
              </View>
              <View style={styles.avatarInfo}>
                <Text style={styles.phoneLabel}>Verified Phone Number</Text>
                <View style={styles.verifiedRow}>
                  <Text style={styles.phoneValue}>
                    {user?.phoneNumber ?? '+94 77 123 4567'}
                  </Text>
                  <View style={styles.verifiedPill}>
                    <Text style={styles.verifiedText}>✓ Verified</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Full Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Full Name <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Kamal Perera or Sunil Shantha"
                placeholderTextColor="#7d9089"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

            {/* City Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                Primary City / Region <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.chipsWrap}>
                {(Object.keys(CITY_CENTERS) as SupportedCity[]).map((city) => {
                  const isCitySelected = selectedCity === city;
                  return (
                    <Pressable
                      key={city}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${city}`}
                      onPress={() => setSelectedCity(city)}
                      style={[styles.cityChip, isCitySelected && styles.cityChipSelected]}
                    >
                      <Text style={[styles.cityChipText, isCitySelected && styles.cityChipTextSelected]}>
                        📍 {city}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Role Selection Cards: Client, Worker, or Both */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>How will you use LinkWorks?</Text>
            <Text style={styles.cardSubtitle}>
              Every account can hire tradespeople, offer services, or do both. You can switch roles at any time.
            </Text>

            {/* Role Option 1: Client */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Hire workers client role"
              onPress={() => setRoleChoice('client')}
              style={[
                styles.roleCard,
                roleChoice === 'client' && styles.roleCardSelected,
              ]}
            >
              <View style={styles.roleCardIconContainer}>
                <Text style={styles.roleCardIcon}>💼</Text>
              </View>
              <View style={styles.roleCardBody}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleCardTitle}>Hire Workers (Client)</Text>
                  {roleChoice === 'client' && (
                    <View style={styles.selectedRadioBadge}>
                      <Text style={styles.selectedRadioCheck}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.roleCardDescription}>
                  I need to post home improvement jobs, browse verified local pros, compare quotes, and hire tradespeople.
                </Text>
              </View>
            </Pressable>

            {/* Role Option 2: Worker */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Offer services worker role"
              onPress={() => setRoleChoice('worker')}
              style={[
                styles.roleCard,
                roleChoice === 'worker' && styles.roleCardSelected,
              ]}
            >
              <View style={styles.roleCardIconContainer}>
                <Text style={styles.roleCardIcon}>🛠️</Text>
              </View>
              <View style={styles.roleCardBody}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleCardTitle}>Offer Services (Worker)</Text>
                  {roleChoice === 'worker' && (
                    <View style={styles.selectedRadioBadge}>
                      <Text style={styles.selectedRadioCheck}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.roleCardDescription}>
                  I am a skilled tradesperson looking to find nearby job leads, submit quotes, showcase my work, and earn.
                </Text>
              </View>
            </Pressable>

            {/* Role Option 3: Both (Client & Worker) */}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Both client and worker role"
              onPress={() => setRoleChoice('both')}
              style={[
                styles.roleCard,
                roleChoice === 'both' && styles.roleCardSelected,
              ]}
            >
              <View style={styles.roleCardIconContainer}>
                <Text style={styles.roleCardIcon}>🤝</Text>
              </View>
              <View style={styles.roleCardBody}>
                <View style={styles.roleTitleRow}>
                  <Text style={styles.roleCardTitle}>Both (Client &amp; Worker)</Text>
                  {roleChoice === 'both' && (
                    <View style={styles.selectedRadioBadge}>
                      <Text style={styles.selectedRadioCheck}>✓</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.roleCardDescription}>
                  Full dual access: hire skilled pros when you need help at home, and take on skilled trade jobs with one account.
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Worker Specialties and Skills Section (Revealed when Worker or Both is selected) */}
          {isWorkerSelected && (
            <View style={styles.card}>
              <View style={styles.workerSectionHeader}>
                <Text style={styles.workerSectionBadge}>🛠️ Worker Profile Setup</Text>
                <Text style={styles.cardTitle}>Your Trade Specialties &amp; Skills</Text>
                <Text style={styles.cardSubtitle}>
                  Choose from common trades or add custom skills so nearby clients find you for the right jobs.
                </Text>
              </View>

              {/* Preset Trade Categories */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Select Popular Trades ({skills.length} selected)
                </Text>
                <View style={styles.chipsWrap}>
                  {PRESET_TRADES.map((trade) => {
                    const isSelected = skills.includes(trade.id);
                    return (
                      <Pressable
                        key={trade.id}
                        accessibilityRole="button"
                        accessibilityLabel={`Toggle ${trade.label}`}
                        onPress={() => togglePresetSkill(trade.id)}
                        style={[styles.tradeChip, isSelected && styles.tradeChipSelected]}
                      >
                        <Text style={styles.tradeChipIcon}>{trade.icon}</Text>
                        <Text
                          style={[
                            styles.tradeChipText,
                            isSelected && styles.tradeChipTextSelected,
                          ]}
                        >
                          {trade.label}
                        </Text>
                        {isSelected && <Text style={styles.tradeChipCheck}>✓</Text>}
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Custom Skill Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Add Your Own Custom Skills</Text>
                <View style={styles.customSkillRow}>
                  <TextInput
                    style={styles.customSkillInput}
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
                    style={styles.addSkillButton}
                  >
                    <Text style={styles.addSkillButtonText}>+ Add</Text>
                  </Pressable>
                </View>

                {/* Quick Suggestion Pills */}
                <Text style={styles.quickSuggestionLabel}>Quick Suggestions:</Text>
                <View style={styles.suggestionsWrap}>
                  {QUICK_SUGGESTIONS.map((suggestion) => {
                    const alreadyAdded = skills.includes(suggestion);
                    return (
                      <Pressable
                        key={suggestion}
                        accessibilityRole="button"
                        accessibilityLabel={`Add suggestion ${suggestion}`}
                        onPress={() => handleAddCustomSkill(suggestion)}
                        disabled={alreadyAdded}
                        style={[
                          styles.suggestionChip,
                          alreadyAdded && styles.suggestionChipDisabled,
                        ]}
                      >
                        <Text
                          style={[
                            styles.suggestionChipText,
                            alreadyAdded && styles.suggestionChipTextDisabled,
                          ]}
                        >
                          {alreadyAdded ? '✓ ' : '+ '}
                          {suggestion}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Active Skills List with Remove Buttons */}
              {skills.length > 0 && (
                <View style={styles.activeSkillsContainer}>
                  <Text style={styles.activeSkillsLabel}>Your Profile Skills ({skills.length}):</Text>
                  <View style={styles.chipsWrap}>
                    {skills.map((skill) => (
                      <View key={skill} style={styles.activeSkillPill}>
                        <Text style={styles.activeSkillText}>{skill}</Text>
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Remove skill ${skill}`}
                          onPress={() => handleRemoveSkill(skill)}
                          style={styles.removeSkillPressable}
                        >
                          <Text style={styles.removeSkillText}>×</Text>
                        </Pressable>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Daily Rate & Experience Row */}
              <View style={styles.numericRow}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>
                    Daily Rate (LKR) <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.rateInputContainer}>
                    <Text style={styles.rateCurrency}>Rs.</Text>
                    <TextInput
                      style={styles.rateInput}
                      keyboardType="number-pad"
                      value={dailyRate}
                      onChangeText={setDailyRate}
                      placeholder="4500"
                      placeholderTextColor="#7d9089"
                    />
                    <Text style={styles.rateSuffix}>/ day</Text>
                  </View>
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>
                    Experience (Years) <Text style={styles.requiredAsterisk}>*</Text>
                  </Text>
                  <View style={styles.rateInputContainer}>
                    <TextInput
                      style={styles.rateInput}
                      keyboardType="number-pad"
                      value={experienceYears}
                      onChangeText={setExperienceYears}
                      placeholder="4"
                      placeholderTextColor="#7d9089"
                    />
                    <Text style={styles.rateSuffix}>yrs exp</Text>
                  </View>
                </View>
              </View>

              {/* Service Coverage Radius */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  Service Coverage Radius: {serviceRadius} km from {selectedCity}
                </Text>
                <View style={styles.chipsWrap}>
                  {RADIUS_OPTIONS.map((km) => {
                    const isRadiusSelected = serviceRadius === km;
                    return (
                      <Pressable
                        key={km}
                        accessibilityRole="button"
                        accessibilityLabel={`${km} kilometer radius`}
                        onPress={() => setServiceRadius(km)}
                        style={[
                          styles.radiusChip,
                          isRadiusSelected && styles.radiusChipSelected,
                        ]}
                      >
                        <Text
                          style={[
                            styles.radiusChipText,
                            isRadiusSelected && styles.radiusChipTextSelected,
                          ]}
                        >
                          {km} km
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>

              {/* Short Bio / Experience Summary */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Short Bio &amp; Specialties</Text>
                <TextInput
                  style={styles.bioInput}
                  multiline
                  numberOfLines={3}
                  placeholder="Tell clients about your tools, qualifications, warranty, or specialties..."
                  placeholderTextColor="#7d9089"
                  value={bio}
                  onChangeText={setBio}
                />
              </View>
            </View>
          )}

          {/* Error Message */}
          {error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Complete Account and Enter LinkWorks"
              disabled={busy}
              onPress={() => {
                void handleCompleteSetup();
              }}
              style={({ pressed }) => [
                styles.primarySubmitButton,
                pressed && styles.buttonPressed,
                busy && styles.buttonDisabled,
              ]}
            >
              {busy ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.primarySubmitText}>
                  Complete Setup &amp; Enter LinkWorks →
                </Text>
              )}
            </Pressable>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Sign out"
              onPress={() => {
                void signOut();
                router.replace('/');
              }}
              style={styles.signOutButton}
            >
              <Text style={styles.signOutText}>Cancel &amp; Sign Out</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    padding: spacing.md,
    gap: spacing.md,
    paddingBottom: 48,
  },
  header: {
    gap: 6,
    paddingVertical: spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#e8f5ee',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: palette.brand,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  brandLink: {
    color: '#023e31',
  },
  brandWorks: {
    color: '#034e3f',
  },
  mainTitle: {
    color: palette.heading,
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
    letterSpacing: -0.3,
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: spacing.md,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    color: palette.heading,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  cardSubtitle: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
    marginTop: -8,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingBottom: spacing.xs,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e8f5ee',
    borderWidth: 2,
    borderColor: '#bbf7d0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  avatarText: {
    color: palette.brand,
    fontSize: 26,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  avatarCameraBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  cameraIcon: {
    fontSize: 11,
  },
  avatarInfo: {
    flex: 1,
    gap: 4,
  },
  phoneLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  phoneValue: {
    color: palette.heading,
    fontSize: 15,
    fontWeight: '700',
  },
  verifiedPill: {
    backgroundColor: '#e8f5ee',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: {
    color: palette.brand,
    fontSize: 11,
    fontWeight: '700',
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    color: palette.heading,
    fontSize: 14,
    fontWeight: '700',
  },
  requiredAsterisk: {
    color: palette.danger,
  },
  textInput: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: palette.heading,
    backgroundColor: '#ffffff',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  cityChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f3',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cityChipSelected: {
    backgroundColor: '#e8f5ee',
    borderColor: palette.brand,
  },
  cityChipText: {
    fontSize: 13,
    color: palette.body,
    fontWeight: '600',
  },
  cityChipTextSelected: {
    color: palette.brand,
    fontWeight: '700',
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    backgroundColor: '#fafcfb',
    gap: spacing.sm,
  },
  roleCardSelected: {
    borderColor: palette.brand,
    backgroundColor: '#e8f5ee',
  },
  roleCardIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: palette.border,
  },
  roleCardIcon: {
    fontSize: 22,
  },
  roleCardBody: {
    flex: 1,
    gap: 4,
  },
  roleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  roleCardTitle: {
    color: palette.heading,
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  selectedRadioBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedRadioCheck: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  roleCardDescription: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  workerSectionHeader: {
    gap: 4,
    paddingBottom: 4,
  },
  workerSectionBadge: {
    color: palette.brand,
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  tradeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: '#f1f5f3',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  tradeChipSelected: {
    backgroundColor: '#e8f5ee',
    borderColor: palette.brand,
  },
  tradeChipIcon: {
    fontSize: 14,
  },
  tradeChipText: {
    fontSize: 13,
    color: palette.body,
    fontWeight: '600',
  },
  tradeChipTextSelected: {
    color: palette.brand,
    fontWeight: '700',
  },
  tradeChipCheck: {
    color: palette.brand,
    fontSize: 12,
    fontWeight: '800',
  },
  customSkillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  customSkillInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.heading,
    backgroundColor: '#ffffff',
  },
  addSkillButton: {
    backgroundColor: palette.brand,
    borderRadius: 12,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addSkillButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  quickSuggestionLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  suggestionsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  suggestionChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#f8faf9',
    borderWidth: 1,
    borderColor: '#d1ded8',
  },
  suggestionChipDisabled: {
    opacity: 0.4,
  },
  suggestionChipText: {
    fontSize: 12,
    color: palette.muted,
    fontWeight: '600',
  },
  suggestionChipTextDisabled: {
    color: '#94a3b8',
  },
  activeSkillsContainer: {
    backgroundColor: '#f8faf9',
    borderRadius: 14,
    padding: spacing.sm,
    gap: 8,
    borderWidth: 1,
    borderColor: '#e8f0ec',
  },
  activeSkillsLabel: {
    color: palette.brand,
    fontSize: 13,
    fontWeight: '700',
  },
  activeSkillPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingLeft: 10,
    paddingRight: 6,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: palette.brand,
    gap: 6,
  },
  activeSkillText: {
    color: palette.brand,
    fontSize: 12,
    fontWeight: '700',
  },
  removeSkillPressable: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeSkillText: {
    color: palette.danger,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 14,
  },
  numericRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  rateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  rateCurrency: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.muted,
    marginRight: 4,
  },
  rateInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontWeight: '700',
    color: palette.heading,
  },
  rateSuffix: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.muted,
    marginLeft: 4,
  },
  radiusChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: '#f1f5f3',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  radiusChipSelected: {
    backgroundColor: '#e8f5ee',
    borderColor: palette.brand,
  },
  radiusChipText: {
    fontSize: 13,
    color: palette.body,
    fontWeight: '600',
  },
  radiusChipTextSelected: {
    color: palette.brand,
    fontWeight: '700',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: palette.heading,
    backgroundColor: '#ffffff',
    minHeight: 70,
    textAlignVertical: 'top',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  errorIcon: {
    fontSize: 16,
  },
  errorText: {
    flex: 1,
    color: palette.danger,
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  actionContainer: {
    gap: 10,
    marginTop: spacing.xs,
  },
  primarySubmitButton: {
    backgroundColor: palette.brand,
    borderRadius: 28,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.brand,
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primarySubmitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signOutButton: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signOutText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '600',
  },
});
