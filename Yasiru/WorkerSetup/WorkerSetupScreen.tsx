import { doc, getDocFromServer, getFirestore, serverTimestamp, setDoc } from '@react-native-firebase/firestore';
import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Action, Card, Field, Page, Status } from '../../Bhashitha/Design/Primitives';
import { palette } from '../../Bhashitha/Design/theme';
import { CITY_CENTERS, geohashForPoint, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { useAuth } from '../Auth/AuthContext';

const SKILLS = ['Carpentry', 'Plumbing', 'Electrical', 'Masonry', 'Painting', 'Gardening', 'AC Repair', 'Roofing'] as const;

// Collect the public service area and skills needed for worker discovery.
export default function WorkerSetupScreen() {
  const { user, profile, refreshProfile, signOut } = useAuth();
  const initialCity: SupportedCity = profile?.city && profile.city in CITY_CENTERS ? profile.city as SupportedCity : 'Colombo';
  const [city, setCity] = useState<SupportedCity>(initialCity);
  const [skills, setSkills] = useState<string[]>([]);
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('0');
  const [rate, setRate] = useState('');
  const [radius, setRadius] = useState('10');
  const [available, setAvailable] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Toggle one skill without losing the other selected categories.
  function toggleSkill(skill: string) {
    setSkills((current) => current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill]);
  }

  // Save only editable worker fields on updates; trusted counters start at zero on creation.
  async function save() {
    if (!user || !profile) return;
    const experienceYears = Number(experience);
    const dayRateLkr = Number(rate);
    const serviceRadiusKm = Number(radius);
    if (!skills.length || bio.trim().length < 10 || !Number.isInteger(experienceYears) || experienceYears < 0 ||
      !Number.isInteger(dayRateLkr) || dayRateLkr <= 0 || !Number.isInteger(serviceRadiusKm) ||
      serviceRadiusKm < 1 || serviceRadiusKm > 50) {
      setError('Choose a skill, add a short bio, and enter valid years, daily rate, and a 1–50 km radius.');
      return;
    }
    try {
      setBusy(true);
      setError('');
      const reference = doc(getFirestore(), 'workerProfiles', user.uid);
      const existing = await getDocFromServer(reference);
      const center = CITY_CENTERS[city];
      await setDoc(reference, {
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
        ...(existing.exists() ? {} : {
          createdAt: serverTimestamp(),
          ratingAvg: 0,
          ratingCount: 0,
          jobsCompleted: 0,
        }),
      }, { merge: true });
      await refreshProfile();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setBusy(false);
    }
  }

  return <Page>
    <Text style={styles.title}>Set up your services</Text>
    <Text style={styles.help}>Choose your service city now. Precise nearby search will be added in the next phase.</Text>
    <Card title="Skills and area">
      <Text style={styles.label}>Skills</Text>
      <View style={styles.wrap}>{SKILLS.map((skill) => <Pressable key={skill} accessibilityRole="button" onPress={() => toggleSkill(skill)} style={[styles.chip, skills.includes(skill) && styles.selected]}><Text style={[styles.chipText, skills.includes(skill) && styles.selectedText]}>{skill}</Text></Pressable>)}</View>
      <Text style={styles.label}>Service city</Text>
      <View style={styles.wrap}>{(Object.keys(CITY_CENTERS) as SupportedCity[]).map((option) => <Pressable key={option} accessibilityRole="button" onPress={() => setCity(option)} style={[styles.chip, city === option && styles.selected]}><Text style={[styles.chipText, city === option && styles.selectedText]}>{option}</Text></Pressable>)}</View>
      <Field label="Short bio" multiline value={bio} onChangeText={setBio} placeholder="Describe your services and experience" />
      <Field label="Experience in years" keyboardType="number-pad" value={experience} onChangeText={setExperience} />
      <Field label="Daily rate in LKR" keyboardType="number-pad" value={rate} onChangeText={setRate} />
      <Field label="Service radius in km (1–50)" keyboardType="number-pad" value={radius} onChangeText={setRadius} />
      <View style={styles.switchRow}><Text style={styles.label}>Available for work</Text><Switch accessibilityLabel="Available for work" value={available} onValueChange={setAvailable} /></View>
      <Action label="Save worker profile" onPress={() => { void save(); }} busy={busy} />
    </Card>
    {error ? <Status message={error} error /> : null}
    <Action label="Sign out" secondary onPress={() => { void signOut(); }} />
  </Page>;
}

const styles = StyleSheet.create({
  title: { color: palette.heading, fontFamily: 'Plus Jakarta Sans', fontSize: 28, fontWeight: '800' },
  help: { color: palette.muted, lineHeight: 20 },
  label: { color: palette.heading, fontSize: 15, fontWeight: '600' },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderColor: palette.border, borderWidth: 1, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8 },
  selected: { backgroundColor: palette.primary, borderColor: palette.primary },
  chipText: { color: palette.heading },
  selectedText: { color: '#fff' },
  switchRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
