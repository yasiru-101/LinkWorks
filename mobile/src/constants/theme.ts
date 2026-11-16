/**
 * LinkWorks Design Tokens & Theme Constants
 * 
 * Owned by: Bhashitha (Design system & UI components)
 * 
 * Provides color palettes, typography mappings, spacing increments, and device inset rules
 * supporting consistent theming across light and dark system appearances.
 */

import '@/global.css';

import { Platform } from 'react-native';

// Standard chromatic palette tokens for light and dark UI themes
export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// Cross-platform font families mapping system fallbacks for iOS, Android, and Web
export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// Uniform 8-point typographic and spatial scale
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

// Bottom navigation bar inset padding to clear system navigation gestures
export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;

// Maximum container width for widescreen responsive tablet and web layouts
export const MaxContentWidth = 800;
