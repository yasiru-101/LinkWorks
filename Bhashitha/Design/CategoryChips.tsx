/**
 * LinkWorks Trade Category Filter Chips
 * 
 * Owner: Bhashitha (Design system, navigation, reviews, moderation, seed data, integration and QA)
 * 
 * Renders horizontal scrolling category chips with trade icons:
 * 1. Supports major Sri Lankan trades: Carpentry, Plumbing, Electrical, Masonry, Painting, Gardening, AC Repair, Roofing.
 * 2. Provides active and inactive visual states conforming to the LinkWorks brand palette.
 * 3. Notifies parent components of category selection changes via `onSelect`.
 */

import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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

const CATEGORY_ICONS: Record<TradeCategory, string> = {
  All: '✨',
  Carpentry: '🪚',
  Plumbing: '🔧',
  Electrical: '⚡',
  Masonry: '🧱',
  Painting: '🎨',
  Gardening: '🌿',
  'AC Repair': '❄️',
  Roofing: '🏠',
};

// Horizontal scrolling category chips allowing quick filtering by skilled trade with visual icons.
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
        const icon = CATEGORY_ICONS[category];
        return (
          <Pressable
            key={category}
            accessibilityRole="button"
            accessibilityLabel={`${category} filter`}
            onPress={() => onSelect(category)}
            style={[styles.chip, isSelected && styles.selectedChip]}
          >
            <Text style={styles.icon}>{icon}</Text>
            <Text style={[styles.text, isSelected && styles.selectedText]}>{category} </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: 100,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#d8e6df',
    shadowColor: '#034e3f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  selectedChip: {
    backgroundColor: palette.primary,
    borderColor: palette.primary,
  },
  icon: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 14,
  },
  text: {
    color: palette.heading,
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'Plus Jakarta Sans',
    paddingRight: 4,
  },
  selectedText: {
    color: '#ffffff',
  },
});
