/**
 * LinkWorks Resolved Theme Hook
 * 
 * Owned by: Bhashitha (Design system & UI theming)
 * 
 * Resolves active chromatic palette tokens (Colors.light vs Colors.dark) based on device system settings.
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Hook providing active theme colors adapted to current OS appearance mode
export function useTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;

  return Colors[theme];
}
