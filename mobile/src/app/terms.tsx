import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TermsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Pressable accessibilityRole="button" onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </Pressable>
        <Text style={styles.heading}>Terms &amp; Conditions</Text>
        <Text style={styles.body}>The LinkWorks terms are being prepared for release.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  content: { padding: 24, gap: 20 },
  back: { color: '#034e3f', fontSize: 16, fontWeight: '600' },
  heading: { color: '#023e31', fontSize: 26, fontWeight: '700' },
  body: { color: '#4b635d', fontSize: 16, lineHeight: 24 },
});
