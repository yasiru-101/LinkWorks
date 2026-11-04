import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CITY_CENTERS, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { palette, spacing } from './theme';

// Modal selector for instantly switching the active search city.
export function CitySelectorModal({
  visible,
  currentCity,
  onSelectCity,
  onClose,
}: {
  visible: boolean;
  currentCity: SupportedCity;
  onSelectCity: (city: SupportedCity) => void;
  onClose: () => void;
}) {
  const cities = Object.keys(CITY_CENTERS) as SupportedCity[];

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.dialog} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>Select Service City</Text>
          <Text style={styles.subtitle}>Filter nearby workers and jobs by Sri Lankan city center:</Text>

          <View style={styles.list}>
            {cities.map((city) => {
              const isSelected = city === currentCity;
              return (
                <Pressable
                  key={city}
                  accessibilityRole="button"
                  onPress={() => {
                    onSelectCity(city);
                    onClose();
                  }}
                  style={[styles.cityRow, isSelected && styles.selectedRow]}
                >
                  <Text style={[styles.cityName, isSelected && styles.selectedName]}>{city}</Text>
                  {isSelected ? <Text style={styles.checkmark}>✓</Text> : null}
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
  },
  dialog: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    color: palette.heading,
    fontSize: 20,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  list: {
    gap: spacing.xs,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: palette.background,
  },
  selectedRow: {
    backgroundColor: palette.primary,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.heading,
  },
  selectedName: {
    color: '#ffffff',
  },
  checkmark: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: spacing.xs,
  },
  closeText: {
    color: palette.muted,
    fontSize: 15,
    fontWeight: '600',
  },
});
