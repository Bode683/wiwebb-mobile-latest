import { Platform } from 'react-native';

const systemFont = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'System',
});

/**
 * Font family names match the CSS theme: --font-sans, --font-serif, --font-mono.
 * Load these via expo-font / @expo-google-fonts before use; system fonts are
 * the fallback if they have not been loaded.
 */
export const typography = {
  fonts: {
    sans:    'Inter',
    serif:   'SourceSerif4',
    mono:    'JetBrainsMono',
    regular: systemFont,   // system fallback
    medium:  systemFont,
    bold:    systemFont,
  },

  // Raw scale
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 34,
    '5xl': 40,
  },

  weights: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
  } as const,

  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },

  letterSpacings: {
    tighter: -0.5,
    tight: -0.25,
    normal: 0,
    wide: 0.25,
    wider: 0.5,
    widest: 1,
  },

  // Material Design 3 type scale
  variants: {
    displayLarge:   { fontSize: 57, lineHeight: 64, fontWeight: '400' as const, letterSpacing: -0.25 },
    displayMedium:  { fontSize: 45, lineHeight: 52, fontWeight: '400' as const, letterSpacing: 0 },
    displaySmall:   { fontSize: 36, lineHeight: 44, fontWeight: '400' as const, letterSpacing: 0 },
    headlineLarge:  { fontSize: 32, lineHeight: 40, fontWeight: '400' as const, letterSpacing: 0 },
    headlineMedium: { fontSize: 28, lineHeight: 36, fontWeight: '400' as const, letterSpacing: 0 },
    headlineSmall:  { fontSize: 24, lineHeight: 32, fontWeight: '400' as const, letterSpacing: 0 },
    titleLarge:     { fontSize: 22, lineHeight: 28, fontWeight: '500' as const, letterSpacing: 0 },
    titleMedium:    { fontSize: 16, lineHeight: 24, fontWeight: '500' as const, letterSpacing: 0.15 },
    titleSmall:     { fontSize: 14, lineHeight: 20, fontWeight: '500' as const, letterSpacing: 0.1 },
    bodyLarge:      { fontSize: 16, lineHeight: 24, fontWeight: '400' as const, letterSpacing: 0.15 },
    bodyMedium:     { fontSize: 14, lineHeight: 20, fontWeight: '400' as const, letterSpacing: 0.25 },
    bodySmall:      { fontSize: 12, lineHeight: 16, fontWeight: '400' as const, letterSpacing: 0.4 },
    labelLarge:     { fontSize: 14, lineHeight: 20, fontWeight: '500' as const, letterSpacing: 0.1 },
    labelMedium:    { fontSize: 12, lineHeight: 16, fontWeight: '500' as const, letterSpacing: 0.5 },
    labelSmall:     { fontSize: 11, lineHeight: 16, fontWeight: '500' as const, letterSpacing: 0.5 },
  },
} as const;

export type TypographyVariant = keyof typeof typography.variants;
