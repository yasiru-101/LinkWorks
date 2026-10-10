import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WebPreview() {
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [phone, setPhone] = useState('');
  const [showProfile, setShowProfile] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.eyebrow}>LINKWORKS</Text>
        <Text style={styles.title}>{mode === 'register' ? 'Create Account' : 'Log In'}</Text>
        <Text style={styles.subtitle}>Continue with your phone number</Text>
        <View style={styles.notice}>
          <Text style={styles.noticeText}>
            Visual preview only. Phone verification and Firestore run in the Android development build.
          </Text>
        </View>
        {showProfile ? (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Your profile</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput placeholder="Your name" style={styles.input} />
            <Text style={styles.label}>City</Text>
            <TextInput placeholder="Your city" style={styles.input} />
            <Text style={styles.help}>Client and worker roles are selected in the Android app.</Text>
            <Pressable onPress={() => setShowProfile(false)} style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Back to sign-in preview</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Sign in with your phone</Text>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              onChangeText={setPhone}
              placeholder="+94771234567"
              style={styles.input}
              value={phone}
            />
            <Pressable onPress={() => setShowProfile(true)} style={styles.button}>
              <Text style={styles.buttonText}>Preview profile screen</Text>
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
  notice: { backgroundColor: '#e6f1ec', borderRadius: 10, padding: 14 },
  noticeText: { color: '#17644b', fontSize: 14, lineHeight: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, gap: 10 },
  sectionTitle: { color: '#17212b', fontSize: 20, fontWeight: '700', marginBottom: 4 },
  label: { color: '#344454', fontSize: 14, fontWeight: '600' },
  value: { color: '#17212b', fontSize: 17, fontWeight: '600' },
  help: { color: '#617181', fontSize: 13, lineHeight: 19 },
  input: { borderColor: '#cbd5df', borderRadius: 10, borderWidth: 1, padding: 12, fontSize: 16 },
  button: { alignItems: 'center', backgroundColor: '#034e3f', borderRadius: 30, padding: 14 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  secondaryButton: { alignItems: 'center', padding: 10 },
  secondaryButtonText: { color: '#034e3f', fontSize: 15, fontWeight: '600' },
});
