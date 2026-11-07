import { StyleSheet, Text } from 'react-native';
import { Card, Page } from '../Design/Primitives';
import { palette } from '../Design/theme';

// Name the upcoming feature honestly while Phase 1 verifies protected navigation.
export default function PlaceholderScreen({ title, nextPhase }: { title: string; nextPhase: 2 | 3 }) {
  return <Page><Text style={styles.title}>{title}</Text><Card><Text style={styles.body}>This screen is scheduled for Phase {nextPhase}. The account and role navigation are ready.</Text></Card></Page>;
}

const styles = StyleSheet.create({
  title: { color: palette.heading, fontSize: 28, fontWeight: '800', fontFamily: 'Plus Jakarta Sans' },
  body: { color: palette.muted, lineHeight: 22 },
});
