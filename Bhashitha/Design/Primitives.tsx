import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { palette, spacing } from './theme';

// Provide consistent page padding and scrolling on small Android screens.
export function Page({ children }: { children: ReactNode }) {
  return <SafeAreaView style={styles.safe}><ScrollView contentContainerStyle={styles.page} keyboardShouldPersistTaps="handled">{children}</ScrollView></SafeAreaView>;
}

// Label a group of related controls with the same heading and card surface.
export function Card({ title, children }: { title?: string; children: ReactNode }) {
  return <View style={styles.card}>{title ? <Text style={styles.cardTitle}>{title}</Text> : null}{children}</View>;
}

// Reuse one accessible field pattern for account and worker setup forms.
export function Field({ label, error, ...props }: TextInputProps & { label: string; error?: string }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#7d9089" style={styles.input} {...props} />{error ? <Text style={styles.error}>{error}</Text> : null}</View>;
}

// Keep primary actions consistent and indicate when an operation is in progress.
export function Action({ label, onPress, disabled = false, busy = false, secondary = false }: { label: string; onPress: () => void; disabled?: boolean; busy?: boolean; secondary?: boolean }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={label} disabled={disabled || busy} onPress={onPress} style={[styles.action, secondary ? styles.secondary : styles.primary, (disabled || busy) && styles.disabled]}>{busy ? <ActivityIndicator color={secondary ? palette.primary : '#fff'} /> : <Text style={[styles.actionText, secondary && styles.secondaryText]}>{label}</Text>}</Pressable>;
}

// Make errors and loading states visible without requiring a separate screen.
export function Status({ message, error = false }: { message: string; error?: boolean }) {
  return <Text accessibilityLiveRegion="polite" style={[styles.status, error && styles.error]}>{message}</Text>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.background },
  page: { padding: spacing.lg, gap: spacing.md, paddingBottom: spacing.xl },
  card: { backgroundColor: palette.surface, borderRadius: 18, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: palette.border },
  cardTitle: { color: palette.heading, fontSize: 20, fontWeight: '700', fontFamily: 'Plus Jakarta Sans' },
  field: { gap: spacing.xs },
  label: { color: palette.heading, fontSize: 14, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: palette.border, borderRadius: 12, padding: 13, fontSize: 16, color: palette.heading, backgroundColor: '#fff' },
  action: { minHeight: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  primary: { backgroundColor: palette.primary },
  secondary: { borderColor: palette.primary, borderWidth: 1, backgroundColor: palette.surface },
  disabled: { opacity: 0.5 },
  actionText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryText: { color: palette.primary },
  status: { color: palette.muted, fontSize: 14, lineHeight: 20 },
  error: { color: palette.danger },
});
