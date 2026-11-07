import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { palette, spacing } from './theme';

export const TRADE_CATEGORIES = [
  'All',
  'Carpentry',
  'Plumbing',
  'Electrical',
  'Masonry',
  'Painting',
  'Gardening',
  'AC Repair',
  'Roofing',
] as const;

export type TradeCategory = typeof TRADE_CATEGORIES[number];

// Horizontal scrolling category chips allowing quick filtering by skilled trade.
export function CategoryChips({
  selected,
  onSelect,
}: {
  selected: TradeCategory;
  onSelect: (category: TradeCategory) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TRADE_CATEGORIES.map((category) => {
        const isSelected = selected === category;
        return (
          <Pressable
            key={category}
            accessibilityRole="button"
            accessibilityLabel={`${category} filter`}
            onPress={() => onSelect(category)}
            style={[styles.chip, isSelected && styles.selectedChip]}
          >
            <Text style={[styles.text, isSelected && styles.selectedText]}>{category}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: palette.surface,
    borderWidth: 1,
    borderColor: palette.border,
  },
  selectedChip: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  text: {
    color: palette.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  selectedText: {
    color: '#ffffff',
  },
});
