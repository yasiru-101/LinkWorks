/**
 * LinkWorks Adaptive Background View Primitive
 * 
 * Owned by: Bhashitha (Design system & UI components)
 * 
 * Standard container component automatically adapting background colors to the active theme palette.
 */

import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

// Layout container primitive applying themed background tokens
export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const theme = useTheme();

  return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />;
}
