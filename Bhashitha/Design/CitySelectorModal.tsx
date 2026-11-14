import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { CITY_CENTERS, type SupportedCity } from '../../Pasindu/Discovery/geo';
import { palette, spacing } from './theme';

// Modal selector for switching the active search city or reverting to live GPS.
export function CitySelectorModal({
  visible,
  currentCity,
  onSelectCity,
  onUseGps,
  onClose,
}: {
  visible: boolean;
  currentCity: SupportedCity;
  onSelectCity: (city: SupportedCity) => void;
  onUseGps?: () => void;
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
          <Text style={styles.title}>Select Location</Text>
          <Text style={styles.subtitle}>
            Filter nearby workers and jobs by your live GPS position or a supported Sri Lankan city:
          </Text>

          {/* Quick Action: Use Live Device GPS */}
          {onUseGps ? (
            <Pressable
              accessibilityRole="button"
              style={styles.gpsRow}
              onPress={() => {
                onUseGps();
                onClose();
              }}
            >
              <Text style={styles.gpsIcon}>📍</Text>
              <View style={styles.gpsTextContainer}>
                <Text style={styles.gpsTitle}>Use Current GPS Location</Text>
                <Text style={styles.gpsSubtitle}>Detect via Fused Location Provider</Text>
              </View>
              <Text style={styles.gpsArrow}>→</Text>
            </Pressable>
          ) : null}

          <View style={styles.divider}>
            <Text style={styles.dividerText}>OR SELECT CITY</Text>
          </View>

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
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: spacing.md,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    color: palette.heading,
    fontSize: 18,
    fontWeight: '800',
    fontFamily: 'Plus Jakarta Sans',
  },
  subtitle: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    marginVertical: 4,
  },
  gpsIcon: {
    fontSize: 20,
  },
  gpsTextContainer: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#166534',
  },
  gpsSubtitle: {
    fontSize: 11,
    color: '#15803d',
  },
  gpsArrow: {
    fontSize: 16,
    color: '#166534',
    fontWeight: '700',
  },
  divider: {
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.muted,
    letterSpacing: 0.8,
  },
  list: {
    gap: 4,
  },
  cityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedRow: {
    backgroundColor: '#e6f7ef',
  },
  cityName: {
    color: palette.heading,
    fontSize: 15,
    fontWeight: '600',
  },
  selectedName: {
    color: palette.primary,
    fontWeight: '800',
  },
  checkmark: {
    color: palette.primary,
    fontSize: 15,
    fontWeight: '800',
  },
  closeButton: {
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: spacing.xs,
  },
  closeText: {
    color: palette.muted,
    fontSize: 14,
    fontWeight: '700',
  },
});
