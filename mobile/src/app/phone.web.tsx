import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../Yasiru/Auth/AuthContext';

// Web preview screen offering interactive demo entry points for Client and Worker testing.
export default function WebPreview() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const { signInDemoClient, signInDemoWorker, saveProfile } = useAuth();
  const [phone, setPhone] = useState('+94771234567');
  const [name, setName] = useState('Kamal Perera');
  const [city, setCity] = useState('Colombo');
  const [showProfile, setShowProfile] = useState(false);

  // Sign in and enter the app as client.
  function handleDemoClient() {
    signInDemoClient?.();
    router.replace('/(main)/home');
  }

  // Sign in and enter the app as worker.
  function handleDemoWorker() {
    signInDemoWorker?.();
    router.replace('/(main)/feed');
  }

  // Save customized web profile and enter.
  async function handleSaveCustom() {
    await saveProfile({
      name,
      city,
      isClient: true,
      isWorker: true,
    });
    router.replace('/(main)/home');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.eyebrow}>LINKWORKS</Text>
        <Text style={styles.title}>{mode === 'register' ? 'Create Account' : 'Log In'}</Text>
        <Text style={styles.subtitle}>Test LinkWorks directly in your browser</Text>

        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>Browser Preview Ready</Text>
          <Text style={styles.noticeText}>
            You can test the entire Phase 2 discovery and job posting experience right here in your browser using fictional Sri Lankan demo data.
          </Text>
        </View>

        {/* Quick Demo Test Buttons */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Instant Interactive Demo</Text>
          <Text style={styles.help}>Choose a role to enter the application immediately:</Text>

          <Pressable onPress={handleDemoClient} style={styles.button}>
            <Text style={styles.buttonText}>Enter as Client (Find Workers & Post Jobs) →</Text>
          </Pressable>

          <Pressable onPress={handleDemoWorker} style={[styles.button, styles.workerButton]}>
            <Text style={styles.buttonText}>Enter as Worker (Matching Job Feed) →</Text>
          </Pressable>
        </View>

        {showProfile ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Custom Profile</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              placeholder="Your name"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <Text style={styles.label}>City</Text>
            <TextInput
              placeholder="Your city"
              value={city}
              onChangeText={setCity}
              style={styles.input}
            />
            <Pressable onPress={() => { void handleSaveCustom(); }} style={styles.button}>
              <Text style={styles.buttonText}>Enter with Custom Profile</Text>
            </Pressable>
            <Pressable onPress={() => setShowProfile(false)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Phone Sign-In</Text>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              onChangeText={setPhone}
              placeholder="+94771234567"
              style={styles.input}
              value={phone}
            />
            <Pressable onPress={() => setShowProfile(true)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Set Custom Name & City First</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5faf8' },
  content: { width: '100%', maxWidth: 520, alignSelf: 'center', padding: 24, gap: 18, paddingBottom: 48 },
  back: { color: '#034e3f', fontFamily: 'Plus Jakarta Sans', fontSize: 15, fontWeight: '600' },
  eyebrow: { color: '#034e3f', fontFamily: 'Plus Jakarta Sans', fontSize: 13, fontWeight: '700', letterSpacing: 2 },
  title: { color: '#023e31', fontFamily: 'Plus Jakarta Sans', fontSize: 30, fontWeight: '800' },
  subtitle: { color: '#4b635d', fontFamily: 'Plus Jakarta Sans', fontSize: 16 },
  notice: { backgroundColor: '#e6f1ec', borderRadius: 12, padding: 16, gap: 4 },
  noticeTitle: { color: '#034e3f', fontSize: 15, fontWeight: '700' },
  noticeText: { color: '#17644b', fontSize: 13, lineHeight: 19 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 12 },
  sectionTitle: { color: '#17212b', fontSize: 18, fontWeight: '700' },
  label: { color: '#344454', fontSize: 14, fontWeight: '600' },
  help: { color: '#617181', fontSize: 13, lineHeight: 19 },
  input: { borderColor: '#cbd5df', borderRadius: 10, borderWidth: 1, padding: 12, fontSize: 16 },
  button: { alignItems: 'center', backgroundColor: '#034e3f', borderRadius: 30, padding: 14 },
  workerButton: { backgroundColor: '#025041' },
  buttonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', padding: 10 },
  secondaryButtonText: { color: '#034e3f', fontSize: 15, fontWeight: '600' },
});
